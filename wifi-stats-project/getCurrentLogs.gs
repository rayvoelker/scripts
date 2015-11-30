function getCurrentLogs() {
  //uncompresses the .csv file containing the logs for the latest log files sent 
  // as an email attachment from ncs-prime@udayton.edu
  
  var controller_sheet_id = "PUT_SHEET_ID_HERE";
  var stats_folder_id = "PUT_FOLDER_ID_HERE";
  
  var tomorrow_date = new Date();
  tomorrow_date.setDate(tomorrow_date.getDate() + 1);
  var tomorrow = Utilities.formatDate(tomorrow_date, "GMT-5", "yyyy-MM-dd");
  var today = Utilities.formatDate(new Date(), "GMT-5", "yyyy-MM-dd");
  
  // debugging 
  //Logger.log("tomorrow: " + tomorrow);
  
  var query = "from:ncs-prime@udayton.edu to:isda@udayton.edu has:attachment before:" + tomorrow;
  //get only the latest (1) email that matches our search query 
  var threads = GmailApp.search(query,0,1);
  
  // debugging
  //Logger.log("query: " + query + "\n" + threads.length);
  
  if (threads.length) {

    // debugging
    //Logger.log(threads[0].getId());
    var message = threads[0].getMessages();
    var attachments = message[0].getAttachments();
    
    if (attachments.length) {
      var blob = Utilities.unzip(attachments[0].copyBlob());
      
      // debuggin
      //Logger.log(attachments[0].getName())
      //Logger.log(blob[0].getContentType());
      
      //create a new spreadsheet in the stats folder and log it in the controller spreadsheet
      var csv = Utilities.parseCsv(blob[0].getDataAsString());
      
      // debugger
      //Logger.log(csv.length);
      
      //it looks like row 8 is where the data starts... so remove those elements
      csv = csv.slice(8,csv.length);

      var spreadsheet = SpreadsheetApp.create("wireless_logs_" + today, csv.length, csv[0].length);
      var sheet = spreadsheet.getSheets()[0];
            
      var controller_ss = SpreadsheetApp.openById(controller_sheet_id);
      var controller = controller_ss.getSheets()[0];
      
      //set the values in the logging sheet, and the newly created sheet.
      controller.appendRow(["wireless_logs_" + today, spreadsheet.getUrl(), csv.length, spreadsheet.getId()]);
      var range = sheet.getRange(1,1,csv.length,csv[0].length);
      
      //here is were we may want to loop through the csv and obfuscate the usernames with the function we choose 
      // before we output the data to the new sheet.
      
      range.setValues(csv);
      
    } //end if
  } //end if
  
  //we didn't get any attachments (or maybe no messages that met our query so return false)
  return false;
  
} //end getCurrentLogs()
