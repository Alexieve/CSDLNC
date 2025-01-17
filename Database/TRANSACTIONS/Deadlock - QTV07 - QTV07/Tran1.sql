DECLARE @MATHUOC INT = 1,
		@TENTHUOC NVARCHAR(255) = N'TEST_DeadLock1',
		@CONGDUNG NVARCHAR(255) = N'TEST_DeadLock1',
		@CHONGCHIDINH NVARCHAR(255) = N'TEST_DeadLock1',
		@TACDUNGPHU NVARCHAR(255) = N'TEST_DeadLock1',
		@HDSD NVARCHAR(255) = N'TEST_DeadLock1',
		@HSD DATE ='4/3/2024',
		@NSX NVARCHAR(255) = N'TEST_DeadLock1',
		@DONGIA INT = 30000,
		@SL INT = 100

EXEC SP_POST_UPDATE_THUOC_T1 @MATHUOC,
						     @TENTHUOC,
						     @CONGDUNG,
						     @CHONGCHIDINH,
						     @TACDUNGPHU,
						     @HDSD,
						     @HSD,
						     @NSX,
						     @DONGIA,
						     @SL

SELECT * FROM THUOC WHERE MATHUOC = 1							 