DECLARE @THUOCARRAY AS THUOCARRAY

INSERT INTO @THUOCARRAY (MATHUOC, SOLUONG)
VALUES (19, 1000), (12, 10), (13, 10)

exec SP_ADD_CHI_TIET_DON_THUOC 200061, '', @THUOCARRAY