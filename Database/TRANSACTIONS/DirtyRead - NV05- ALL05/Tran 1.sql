﻿DECLARE @MAKH INT = 100021,
		@NGAYTT DATE = '4/4/2024',
		@NGUOITT NVARCHAR(255) = N'Nguyễn Lê Hoàng Kha',
		@SOTIENNHAN INT = 9200000,
		@LOAITT NVARCHAR(20) = N'Ví điện tử',
		@NVTHANHTOAN INT = 1,
		@LIST_MAKHDT dbo.LIST_MAKHDT

INSERT INTO @LIST_MAKHDT (MAKHDT)
VALUES (200002);

EXEC SP_POST_CREATE_HOADON  @MAKH,
							@NGAYTT,
							@NGUOITT,
							@SOTIENNHAN,
							@LOAITT,
							@NVTHANHTOAN,
							@LIST_MAKHDT 
