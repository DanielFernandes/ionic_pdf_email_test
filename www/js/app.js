// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('appCtrl', function($scope, starterServ, $cordovaFile, $cordovaEmailComposer) {
   

//--------------------- local storage ------------------- 
  //get screen items
  $scope.playlists = starterServ.checklistData();
  //save screen items
  $scope.saveCheckList = function(){
    window.localStorage.setItem('starterAppCheckList', JSON.stringify($scope.playlists) )
  }
//---------------------------------------------------------

//---------------------------pdf & email ------------------
  $scope.sendEmail = function(){

    var docDefinition = starterServ.docDefinition();

    var pdf;// the PFD document

      pdfMake.createPdf(docDefinition).getBase64(function(encodedString) {
        pdf = encodedString;

        cordova.plugins.email.isAvailable(
          function (isAvailable) {

            if (!isAvailable) $scope.emailPlugin=' Not Available ';

              else cordova.plugins.email.open({ 
                    attachments: [ 'base64:filename.pdf//' + pdf /* pdf-base64 */ ]
                  });
          }//.isAvailable
        );//.email

      });//.pdfMake
  };//.sendEmail
//----------------------------------------------------------

//----------------------file save / retrieve simple test ---
  $scope.fileSaved = ' . . . ';
  $scope.fileRead = ' . . . ';
  $scope.fileContent = ' . . . ';


  $scope.saveFile = function(){
 
    // WRITE
    $cordovaFile.writeFile(cordova.file.dataDirectory, 'file.txt', 'some text for testing' , true)//examplText.toString()
      .then(function (success) {

        $scope.fileSaved = 'File was saved!';

      }, function (error) {

        $scope.fileSaved = 'Not working!';
      });

    }//.writeFile
  
    // READ
    $scope.retrieveFile = function(){

    $cordovaFile.readAsText(cordova.file.dataDirectory, 'file.txt') 
      .then(function (success) {

        $scope.fileRead = 'File was read';
        $scope.fileContent = success;

      }, function (error) {
      
        $scope.fileRead = 'Not working!';

      });

  }//.retrieveFile-----------

})
//---------------------------------------data services------------------------------------------------------------
.service('starterServ', function(){
 
  checklistData = function(){

    if( window.localStorage.getItem('starterAppCheckList') ) return JSON.parse(window.localStorage.getItem('starterAppCheckList'))
      else
        return [
        { title: 'Star Wars', check: true, note:'' },
        { title: 'Matrix', check: true, note:'' },
        { title: 'Batman', check: false, note:'' },
        { title: 'X Man', check: true, note:'' }
        ]
  }//.end checklistData

  docDefinition = function(){
      var data = this.checklistData();
      var body = [ [ { text: 'MOVIE', bold: true }, { text: 'CHECK', bold: true }, { text: 'NOTE', bold: true } ] ];

      data.forEach(function(elem){
        body.push([ elem.title, elem.check.toString(), elem.note ])
      });

      return {
        content: [
                   { text: 'MOVIE LIST STATUS', fontSize: 15 },
                  'This is a test data table!',
                  {
                    table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            widths: [ '*', 'auto', '*' ],

                            body: body
                          }
                  }        
                ]
    };
  }//.docDefinition

  return {
    checklistData:checklistData,
    docDefinition:docDefinition
  }
});
//.end
