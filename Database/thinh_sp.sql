CREATE OR ALTER PROC SP_GET_DATATABLE_LICHHEN
	@FILTERQUERY NVARCHAR(MAX),
	@COLNAME NVARCHAR(MAX),
	@COLSORTORDER NVARCHAR(MAX),
	@OFFSET_START NVARCHAR(MAX),
	@LENGTH NVARCHAR(MAX)
AS
BEGIN
	DECLARE @SQL NVARCHAR(MAX) = N'SELECT COUNT(*) recordsTotal FROM LICHHEN '
	EXEC SP_EXECUTESQL @SQL
	
	SET @SQL = @SQL + @FILTERQUERY
	EXEC SP_EXECUTESQL @SQL

	SET @SQL = 'SELECT * FROM LICHHEN ' + @FILTERQUERY +
                    ' ORDER BY ' + @COLNAME + ' ' + @COLSORTORDER +
                    ' OFFSET ' + @OFFSET_START + ' ROWS FETCH NEXT ' + @LENGTH + ' ROWS ONLY;';
	EXEC SP_EXECUTESQL @SQL
END
GO

CREATE OR ALTER PROC SP_POST_ACCEPT_LICHHEN
    @MaLH INT
AS
BEGIN
    BEGIN TRY
        UPDATE LICHHEN
        SET
            XACNHAN = 1
        WHERE MALH = @MaLH;

        -- Optional: Check if any rows were affected
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('No rows were updated.', 16, 1);
        END
    END TRY
    BEGIN CATCH
        RAISERROR('System error or foreign key violation!', 16, 1);
    END CATCH
END;
go
CREATE OR ALTER PROC SP_POST_DENY_LICHHEN
    @MaLH INT
AS
BEGIN
    BEGIN TRY
        DELETE FROM LICHHEN
        WHERE MALH = @MaLH;
    END TRY
    BEGIN CATCH
        RAISERROR('System error or foreign key violation!', 16, 1);
    END CATCH
END;