﻿-- LOGIN
CREATE OR ALTER PROC SP_LOGIN_KHACHHANG
	@SDT CHAR(10),
	@MATKHAU VARCHAR(50),
	@LOAITK INT,
	@ID INT = NULL OUTPUT,
	@HOTEN NVARCHAR(255) = NULL OUTPUT,
	@LOAINV BIT = NULL OUTPUT
AS
BEGIN
	IF @LOAITK = 1
	BEGIN
		IF EXISTS (
			SELECT 1
			FROM KHACHHANG
			WHERE SDT = @SDT
		)
		BEGIN
			IF @MATKHAU = (
				SELECT MATKHAU
				FROM KHACHHANG
				WHERE SDT = @SDT
			)
			BEGIN
				SELECT @ID = MAKH, @HOTEN = HOTEN
				FROM KHACHHANG
				WHERE SDT = @SDT
				PRINT N'Đăng nhập thành công'
				SET @LOAINV = 0
				RETURN
			END
		END
	END
	ELSE IF @LOAITK = 2
	BEGIN
		IF EXISTS (
			SELECT 1
			FROM NHASI
			WHERE SDT = @SDT
		)
		BEGIN
			IF @MATKHAU = (
				SELECT MATKHAU
				FROM NHASI
				WHERE SDT = @SDT
			)
			BEGIN
				SELECT @ID = MANS, @HOTEN = HOTEN
				FROM NHASI
				WHERE SDT = @SDT
				PRINT N'Đăng nhập thành công'
				SET @LOAINV = 0
				RETURN
			END
		END
	END
	ELSE IF @LOAITK = 3
	BEGIN
		IF EXISTS (
			SELECT 1
			FROM NVNGHIEPVU
			WHERE SDT = @SDT
		)
		BEGIN
			IF @MATKHAU = (
				SELECT MATKHAU
				FROM NVNGHIEPVU
				WHERE SDT = @SDT
			)
			BEGIN
				SELECT @ID = MANV, @HOTEN = HOTEN, @LOAINV = LOAINV
				FROM NVNGHIEPVU
				WHERE SDT = @SDT
				PRINT N'Đăng nhập thành công'
				RETURN
			END
		END
	END
	BEGIN
		RAISERROR('Số điện thoại hoặc mật khẩu không chính xác', 16, 1)
	END
END
GO

-- REGISTER
CREATE OR ALTER PROC SP_REGISTER_KHACHHANG
	@HOTEN NVARCHAR(255),
	@SDT CHAR(10),
	@EMAIL VARCHAR(50),
	@MATKHAU VARCHAR(50)
AS
BEGIN
	IF LEN(@MATKHAU) < 8
	BEGIN
		RAISERROR('Mật khẩu phải dài tối thiếu 8 kí tự', 16, 1)
		RETURN
	END
	BEGIN TRY
		INSERT INTO KHACHHANG VALUES(@HOTEN, @SDT, @EMAIL, @MATKHAU)
	END TRY
	BEGIN CATCH
		RAISERROR('Số điện thoại đã được đăng ký', 16, 1)
	END CATCH
END
GO

-- GET LIST OF HSBN
CREATE OR ALTER PROC SP_GET_LIST_HSBN
	@MAKH INT = NULL
AS
BEGIN
	IF (@MAKH IS NULL) 
	BEGIN
		SELECT *
		FROM HOSOBN
	END
	ELSE
	BEGIN
		SELECT * 
		FROM HOSOBN
		WHERE MAKH = @MAKH
	END
END
GO

-- CREATE HSBN
CREATE OR ALTER PROC SP_CREATE_HSBN
	@MAKH INT = NULL,
	@HOTENBN NVARCHAR(255),
	@NGAYSINH DATE,
	@GIOITINH NVARCHAR(10),
	@SDTBN CHAR(10),
	@DIACHIBN NVARCHAR(255),
	@TTSUCKHOE NVARCHAR(255),
	@TTDIUNG NVARCHAR(255)
AS
BEGIN
	BEGIN TRY
		INSERT INTO HOSOBN VALUES(@MAKH, @HOTENBN, @NGAYSINH, @GIOITINH, @SDTBN, @DIACHIBN, @TTSUCKHOE, @TTDIUNG)
	END TRY
	BEGIN CATCH
		RAISERROR('Lỗi hệ thống hoặc lỗi khoá ngoại!', 16, 1)
	END CATCH
END
GO