-- Mọi lịch hẹn phải được đặt trước ít nhất 1 ngày trước thời gian lịch hẹn định.
CREATE OR ALTER TRIGGER CHECK_NGAYHEN_LICHHEN
ON LICHHEN
AFTER INSERT
AS
BEGIN
	DECLARE @TODAY DATE = GETDATE()
	IF EXISTS (
		SELECT 1
		FROM inserted I
		WHERE I.NGAYHEN <= @TODAY
	)
	BEGIN
        RAISERROR(N'Lịch hẹn phải được đặt trước ít nhất 1 ngày.', 16, 1)
		ROLLBACK
	END
END
GO

-- Khách hàng chỉ được phép hủy lịch hẹn khi lịch hẹn đó chưa được xác nhận.
CREATE OR ALTER TRIGGER CHECK_XOA_LICHHEN
ON LICHHEN
INSTEAD OF DELETE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM DELETED D
        JOIN LICHHEN LH ON D.MALH = LH.MALH
        WHERE LH.XACNHAN = 1 
    )
    BEGIN
        RAISERROR(N'Lịch hẹn đã được xác nhận và không thể hủy bỏ.', 16, 1)
    END
    ELSE
    BEGIN
        DELETE FROM LICHHEN
        WHERE MALH IN (SELECT D.MALH FROM DELETED D);
    END
END
GO

--Một nha sĩ chỉ có thể làm việc tối đa 5 ngày một tuần, và 8 tiếng một ngày.
CREATE TRIGGER LICHLAMVIEC
ON LICHLAMVIEC
AFTER INSERT
AS
BEGIN
	IF EXISTS (
		SELECT 1
		FROM INSERTED I
		WHERE I.GIOKETTHUC - I.GIOBATDAU > 8
	)
	BEGIN
		RAISERROR(N'Số giờ làm việc trong tuần không được vượt quá 8 giờ.', 16, 1)
        ROLLBACK
	END

	DECLARE @I INT = (SELECT COUNT(*) FROM INSERTED)
	DECLARE @LLV INT = (SELECT COUNT(*) FROM LICHLAMVIEC 
						WHERE MANS IN (SELECT MANS FROM INSERTED))
    IF @I + @LLV > 5
    BEGIN
        RAISERROR(N'Số ngày làm việc trong tuần không được vượt quá 5 ngày.', 16, 1)
        ROLLBACK
    END
END;
GO

-- Các đơn thuốc sau khi đã xuất cho bệnh nhân thì không được phép cập nhật
CREATE OR ALTER TRIGGER CHECK_UPDATE_DONTHUOC
ON DONTHUOC
INSTEAD OF UPDATE
AS
BEGIN
    RAISERROR(N'Không được phép cập nhật đơn thuốc.', 16, 1);
    ROLLBACK;
END;
GO
CREATE OR ALTER TRIGGER CHECK_UPDATE_CHITIET_DONTHUOC
ON CHITIET_DONTHUOC
INSTEAD OF UPDATE
AS
BEGIN
    RAISERROR(N'Không được phép cập nhật đơn thuốc.', 16, 1);
    ROLLBACK;
END;
GO


