﻿-- QTV04
CREATE OR ALTER PROC SP_UPDATE_LICHLAMVIEC
	@MANS INT,
	@NEWLLV TMPLICHLAMVIEC READONLY
AS
SET TRAN ISOLATION LEVEL READ COMMITTED
BEGIN TRAN
	BEGIN TRY
		DELETE FROM LICHLAMVIEC
		WHERE MANS = @MANS

		--------------------------
		WAITFOR DELAY '0:0:05'
		--------------------------

		INSERT INTO LICHLAMVIEC (MANS, NGAYLAM, GIOBATDAU, GIOKETTHUC)
		SELECT MANS, NGAYLAM, CONVERT(TIME, GIOBATDAU) AS GIOBATDAU, CONVERT(TIME, GIOKETTHUC) AS GIOKETTHUC
		FROM @NEWLLV
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(MAX) = ERROR_MESSAGE();
		IF CHARINDEX('CK_LICHLAMVIEC_GIOBATDAU', @ErrorMessage) > 0
		BEGIN
			RAISERROR('Giờ bắt đầu làm phải từ 8 giờ sáng!', 16, 1)
		END
		ELSE IF CHARINDEX('CK_LICHLAMVIEC_GIOKETTHUC', @ErrorMessage) > 0
		BEGIN
			RAISERROR('Giờ tan ca phải từ trước 20h!', 16, 1)
		END
		ROLLBACK TRAN
		RETURN
	END CATCH
COMMIT TRAN
GO

-- ALL03
CREATE OR ALTER PROC SP_BOOK_APPOINMENT
	@MACN INT,
	@MANS INT,
	@MAHSBN INT,
	@HOTENBN NVARCHAR(255),
	@SDTBN CHAR(10),
	@HOTENNS NVARCHAR(255),
	@NGAYHEN DATE,
	@GIOHENSTR VARCHAR(10),
	@MATAIKHAM INT
AS
SET TRAN ISOLATION LEVEL READ UNCOMMITTED
BEGIN TRAN
	DECLARE @DAYWEEK INT = DATEPART(WEEKDAY, @NGAYHEN)
	DECLARE @GIOHEN TIME = CONVERT(TIME, @GIOHENSTR)
	
	IF (@MANS IS NOT NULL)
	BEGIN
		------------------------------
		DECLARE @AVAILABLE BIT = 1

		SELECT @AVAILABLE = 0
		FROM LICHHEN
		WHERE MAHSBN = @MAHSBN
		AND NGAYHEN = @NGAYHEN AND GIOHEN = @GIOHEN

		IF (@AVAILABLE = 0)
		BEGIN
			RAISERROR('Hồ sơ bệnh nhân đã có lịch hẹn khác vào thời điểm này!', 16, 1)
			ROLLBACK TRAN
			RETURN
		END

		-----------------------------
		DECLARE @CHECKNGAYHEN BIT = 1
	
		SELECT @CHECKNGAYHEN = 0
		FROM LICHNGHI
		WHERE MANS = @MANS
		AND NGAYNGHI = @NGAYHEN

		IF (@CHECKNGAYHEN = 0)
		BEGIN
			RAISERROR('Nha sĩ trên hiện không làm việc vào ngày này!', 16, 1)
			ROLLBACK TRAN
			RETURN
		END

		-----------------------------
		DECLARE @CHECKGIOHEN BIT = 0

		SELECT @CHECKGIOHEN = 1
		FROM LICHLAMVIEC
		WHERE MANS = @MANS
		AND NGAYLAM = @DAYWEEK
		AND @GIOHEN BETWEEN GIOBATDAU AND GIOKETTHUC

		IF (@CHECKGIOHEN = 0)
		BEGIN
			RAISERROR('Nha sĩ trên hiện không làm việc vào thời gian này!', 16, 1)
			ROLLBACK TRAN
			RETURN
		END

		-----------------------------
		SELECT @AVAILABLE = 0
		FROM LICHHEN
		WHERE MANS = @MANS 
		AND NGAYHEN = @NGAYHEN AND GIOHEN = @GIOHEN

		IF (@AVAILABLE = 0)
		BEGIN
			RAISERROR('Nha sĩ đã có lịch hẹn khác vào thời điểm này!', 16, 1)
			ROLLBACK TRAN
			RETURN
		END

		
		-------------------------------------------------------------------
		BEGIN TRY
			INSERT INTO LICHHEN VALUES (@MANS, @MAHSBN, @HOTENBN, @SDTBN, @HOTENNS, @NGAYHEN, @GIOHEN, 0, @MATAIKHAM)
		END TRY
		BEGIN CATCH
			DECLARE @ERR NVARCHAR(MAX) = ERROR_MESSAGE()
			RAISERROR(@ERR, 16, 1)
			ROLLBACK TRAN
		END CATCH
	END
	ELSE
	BEGIN
		IF EXISTS (
			SELECT 1
			FROM LICHHEN
			WHERE MAHSBN = @MAHSBN AND NGAYHEN = @NGAYHEN AND GIOHEN = @GIOHEN
		)
		BEGIN
			RAISERROR('Hồ sơ bệnh nhân đã có lịch hẹn khác vào thời điểm này!', 16, 1)
			ROLLBACK TRAN
			RETURN
		END

		SELECT TOP 1
			@MANS = NS.MANS,
			@HOTENNS = NS.HOTEN
		FROM
			NHASI NS
		LEFT JOIN 
			LICHNGHI LN ON
						NS.MANS = LN.MANS 
						AND LN.NGAYNGHI = @NGAYHEN
		JOIN
			LICHLAMVIEC LLV ON NS.MANS = LLV.MANS
		LEFT JOIN
			LICHHEN LH ON 
						(LH.MANS = NS.MANS 
						AND LH.NGAYHEN = @NGAYHEN
						AND LH.GIOHEN = @GIOHEN)
						OR
						(LH.MAHSBN = @MAHSBN
						AND LH.NGAYHEN = @NGAYHEN
						AND LH.GIOHEN = @GIOHEN)
		
		WHERE
			NS.MACN = @MACN
			AND LH.MANS IS NULL -- Clustered Index Scan
			AND LN.MANS IS NULL
			AND LLV.NGAYLAM = @DAYWEEK -- Clustered Index Scan
			AND @GIOHEN BETWEEN LLV.GIOBATDAU AND LLV.GIOKETTHUC -- Clustered Index Scan
			
		IF (@MANS IS NULL)
		BEGIN
			RAISERROR('Hiện không có nha sĩ nào rảnh vào thời gian này!', 16, 1)
			ROLLBACK TRAN
			RETURN
		END

		BEGIN TRY
			INSERT INTO LICHHEN VALUES (@MANS, @MAHSBN, @HOTENBN, @SDTBN, @HOTENNS, @NGAYHEN, @GIOHEN, 0, @MATAIKHAM)
		END TRY
		BEGIN CATCH
			DECLARE @ERR2 NVARCHAR(MAX) = ERROR_MESSAGE()
			RAISERROR(@ERR2, 16, 1)
			ROLLBACK TRAN
		END CATCH
	END
COMMIT TRAN
GO