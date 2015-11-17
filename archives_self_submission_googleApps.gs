/* The script is deployed as a web app and renders the form */
function doGet(e) {
  // setting mode to NATIVE is important as file upload fail in IFRAME Sandbox mode.
  return HtmlService.createHtmlOutputFromFile('form.html')
            .setSandboxMode(HtmlService.SandboxMode.NATIVE);  
}
 
/* This function will process the submitted form */
function uploadFiles(form) {
  
  try {
    // this is the main self submission folder under which other folders will be created
    var self_sub_folder_id = "PUT_FOLDER_ID_HERE";
    var self_sub_folder = DriveApp.getFolderById(self_sub_folder_id);
        
    // this is the main sheet where we will store metadata for the submissions
    //var self_sub_spreadsheet = SpreadsheetApp.get
    var self_sub_ss_id = "PUT_SHEET_ID_HERE";
    var self_sub_spreadsheet = SpreadsheetApp.openById(self_sub_ss_id);
    Logger.log(self_sub_spreadsheet.getName());
    var metadata_sheet = self_sub_spreadsheet.getSheets()[0];
    
    /* Get the file uploaded though the form as a blob */
    var file_blob = form.the_file;
    var file = self_sub_folder.createFile(file_blob);
    
    /* Set the file description as the name of the uploader */
    file.setDescription("Uploaded by\nName: " + form.myName + "\nE-mail: " + form.myEmail);

    var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'"); 
    metadata_sheet.appendRow([formattedDate, form.myName, form.myEmail, form.description, form.dateCreated, file.getUrl()]);
        
    /* Return the download URL of the file once its on Google Drive */
    return "File uploaded successfully. Thank you! <br />Please Refresh this page to submit again." 
    //+ file.getUrl();
  } catch (error) {
    
    /* If there's an error, show the error message */
    return error.toString();
  }
  
} //end function uploadFiles
