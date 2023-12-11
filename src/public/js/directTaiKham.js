function TaiKham() {
    const MAHSBN = $('#modalMAHSBN').val()
    const MANS = $('#modalKHAMCHINH').val()
    const MAKHDIEUTRI = $('#modalMAKHDIEUTRI').val()
    var url = '/addTaiKham?MAHSBN=' + MAHSBN + '&MANS=' + MANS + '&MAKHDIEUTRI=' + MAKHDIEUTRI;
    window.location.href = url;
}