EXEC SP_ADD_NGAYNGHI 10, '2023-12-23'
GO

DELETE FROM LICHNGHI
WHERE MANS = 10 AND NGAYNGHI = '2023-12-23'

SELECT *
FROM LICHNGHI
WHERE MANS = 10 AND NGAYNGHI = '2023-12-23'


-- Test single
BEGIN TRAN
	SET TRAN ISOLATION LEVEL SERIALIZABLE
	SELECT *
	FROM LICHHEN WITH (TABLOCK)
	WHERE MANS = 10 AND NGAYHEN = '2023-12-23'
	WAITFOR DELAY '0:0:05'
COMMIT TRAN

exec sp_BlitzLock
go