// The script is deployed as a web app and renders the form //
function doGet(e) {
  var template = HtmlService.createTemplateFromFile("index");
  Logger.log(template);
  // get the user who is submitting the form ...
  template.user_email = Session.getActiveUser().getEmail();
  
  //get the spreadsheet we need for the IT Help Request
  var self_sub_ss_id = "1mX50j6UrQybWWTImc_9GLTi-_szKmTGqDM__hxk36Q0";
  var self_sub_spreadsheet = SpreadsheetApp.openById(self_sub_ss_id);
  
  // issues from the issues sheet
  var issues_sheet = self_sub_spreadsheet.getSheetByName('issues');
  template.issues = issues_sheet.getDataRange().getValues();
  Logger.log(template.issues.toString());
  
  // setting mode to NATIVE is important as file upload fail in IFRAME Sandbox mode.
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}
 
// This function will process the submitted form
function uploadFiles(form) {
  
  try {
    
    //get the date submitted, and the email of the person submitting the form to use later on 
    var submit_date = Utilities.formatDate(new Date(), "GMT-5:00", "yyyy-MM-dd ' ' HH:mm:ss");
    var submit_email = Session.getActiveUser().getEmail();
    
    // this is the main self submission folder under which other folders will be created
    var self_sub_folder_id = "0B6Qj9cWTBfR9a0xNV2MxakhySWs";
    var self_sub_folder = DriveApp.getFolderById(self_sub_folder_id);
        
    // this is the main sheet where we will store metadata for the submissions
    var self_sub_ss_id = "1mX50j6UrQybWWTImc_9GLTi-_szKmTGqDM__hxk36Q0";
    var self_sub_spreadsheet = SpreadsheetApp.openById(self_sub_ss_id);
    // Logger.log(self_sub_spreadsheet.getName());
    
    // the first sheet is where all the data will be stored
    var metadata_sheet = self_sub_spreadsheet.getSheets()[0];
    
    // get the file uploaded though the form as a blob
    var file_blob = form.the_file;
    var file = self_sub_folder.createFile(file_blob);
 
    //if there was a file, we want to rename it and get the URL of the file to update to the spreadsheet
    if (file.getSize() > 0) {
       // set the file description as the name of the uploader
      file.setDescription("Uploaded by\n " + Session.getActiveUser().getEmail());
      var file_name = file.getName();
      file.setName(submit_date + '_' + submit_email + '_' + file_name);
      var file_url = file.getUrl();
    }
    else {
      // remove the empty file, and set the url to null
      file.setTrashed(true);
      file_url = null;
      file_nane = null;
    }

    // finally, add the data to the sheet ...
    metadata_sheet.appendRow([submit_date, submit_email, form.phone_number, form.issue, form.description, file_url]);
    
    // set the height of the row we inserted to what we want
    metadata_sheet.setRowHeight(metadata_sheet.getLastRow(), 120);
    
    // and then sort it descending from the first column (date submitted)
    metadata_sheet.sort(1, false);
    
    
    // prepare the email
    // email list from the email_list sheet
    var email_sheet = self_sub_spreadsheet.getSheetByName('email_list');
    var email_list = email_sheet.getDataRange().getValues();
    var email_to = email_list[0].pop;
    Logger.log(email_to);
    
    var message_subject = "IT Help Request From " + submit_email + " (" + submit_date + ")"; 
    
    var message_body = "";
    var html_message_body = "";
    
    /*
    message_body += 
    html_message_body += 
    */
    
    message_body += "IT Help Request\n";
    html_message_body += "<h3>IT Help Request</h3>";
    
    message_body += "Submitted\t" + submit_date + "\n";
    html_message_body += "<table><tr><td>Submitted</td><td>" + submit_date + "</td></tr>\n";
    
    message_body += "From\t" + submit_email + "\n";
    html_message_body += "<tr><td>From</td><td>" + submit_email + "</td></tr>\n";
    
    message_body += "Phone\t" + form.phone_number + "\n";
    html_message_body += "<tr><td>Phone</td><td>" + form.phone_number + "</td></tr>\n";
    
    
    
    
    
      "Submitted:\t" + submit_date + "\n" +
      "From:\t" + submit_email + "\n" +
      
      "---\n" +
      "Issue:\t" + form.issue + "\n" + 
      "Description:\t" + form.description + "\n" +
      "---\n" + 
      "File Uploaded:\t" + file_url + "\n\n" +
      "IT Help Request Spreadsheet:\t" + self_sub_spreadsheet.getUrl();
    
    // e-mail the people on the email_list sheet
    MailApp.sendEmail(email_list[0].pop(), message_subject, message_body, {
      cc: email_list.toString()
    });
    
    return "Issue submitted successfully.<br />Please Refresh this page to submit again.";
  } catch (error) {
    
    // if there's an error, show the error message
    return error.toString();
  }
  
} //end function uploadFiles
