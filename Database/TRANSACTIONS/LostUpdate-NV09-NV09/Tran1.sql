
DECLARE @MALH INT = 10000 -- Chọn 1 cái xacnhan = 0
--Xem trước khi chạy
--SELECT * FROM LICHHEN WHERE MALH = @MALH 
EXEC SP_POST_ACCEPT_LICHHEN @MALH
--SELECT * FROM LICHHEN WHERE MALH = @MALH
--Xem sau khi chạy
