let app = {
  // Application Constructor
  pages: [],

  init: () => {
    document.addEventListener("deviceready", app.ready);

  },
  ready: () => {


    app.addListeners();
    //app.getNotification();
    app.createReminderlist();
    app.pages = document.querySelectorAll('.page');

    app.pages[0].classList.add('active');

  },
  addListeners: () => {
    document.querySelector('.addBtn').addEventListener('click', app.gotoCreatepage);
    //document.querySelector('.noBtn').addEventListener('click', app.hideModal);
    //document.querySelector('.Confirm').addEventListener('click', app.showConfirm);
    document.querySelector('.cancelBtn').addEventListener('click', app.goHomepage);
    document.querySelector('.saveBtn').addEventListener('click', app.addNote);

    console.log(app.notifications);

    cordova.plugins.notification.local.on("click", function (notification) {
      navigator.notification.alert("clicked: " + notification.id);

      //user has clicked on the popped up notification
      //console.log(notification.data);
    });
    cordova.plugins.notification.local.on("trigger", function (notification) {
      //added to the notification center on the date to trigger it.
      // navigator.notification.alert("triggered: " + notification.id);
      console.log(notification.id);
    });

  },
  addNote: function () {

    let id = new Date().getMilliseconds();
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let reminderDate = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    let oneWeek = reminderDate - (7 * 24 * 60 * 60 * 1000);

    let noteOptions = {
      id: id,
      title: title,
      at: oneWeek,
      badge: 1,
      data: title + " " + date + " " + time
    };

    let listContainer = document.querySelector(".list-container");
    let listItem = document.createElement("li");

    let h2 = document.createElement('h2');
    h2.textContent = title;

    let p = document.createElement('p');
    p.textContent = noteOptions.data;

    console.log('title is:', title, "h2 is", h2);



    listItem.appendChild(p);
    //listItem.appendChild(noteOptions.data);
    listContainer.appendChild(listItem);
    deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "deleteBtn");
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click", app.showConfirm);
    listItem.appendChild(deleteBtn);

    console.log("li is", listContainer);

    /**
     * Notification Object Properties - use it as a reference later on
     * id
     * text
     * title
     * every
     * at
     * data
     * sound
     * badge
     */
    // let inOneMin = new Date();
    // inOneMin.setMinutes(inOneMin.getMinutes() + 1);
    // let id = new Date().getMilliseconds();
    // let reminderDate = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    // let oneWeek = reminderDate - (7 * 24 * 60 * 60 * 1000);
    // //new Date((date + " " + time).replace(/-/g, "/")).getTime() - (7 * 24 * 60 * 60 * 1000);
    // // console.log(inOneMin);
    // // console.log(date, time);
    // // let DateTime = luxon.DateTime;
    // // let dt = DateTime.local(year, month, day, hour, min); //pass year, month, day, hour, minute, gives milliseconds 
    // // console.log(dt.ts);

    // console.log(oneWeek);
    // let noteOptions = {
    //   id: id,
    //   title: title,
    //   at: oneWeek,
    //   badge: 1,
    //   data: title+" "+date+" "+time
    // };

    cordova.plugins.notification.local.schedule(noteOptions);


    navigator.notification.alert("Added notification id " + id);

    //app.getNotification();

    //app.createReminderlist();

    // cordova.plugins.notification.local.cancel(id, function () {

    //});
    cordova.plugins.notification.local.isPresent(id, function (present) {

    });

    app.goHomepage();
    // clearing input fields
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";

  },

  /*****************************   SPA   *******************************/
  gotoCreatepage: () => {
    app.pages[1].classList.add('active');
    app.pages[0].classList.remove('active');
    console.log('clicked');
  },
  goHomepage: () => {
    app.pages[0].classList.add('active');
    app.pages[1].classList.remove('active');
  },
  /*****************************   MODAL   *******************************/

  showConfirm: (ev) => {

    let id = ev.currentTarget.getAttribute("data-id");
    console.log("ev id is", id);
    let p = ev.currentTarget;

    navigator.notification.confirm("Are you sure you want to delete?", (responseIndex) => {
      if (responseIndex === 2) { //confirm
        app.deleteReminder(p);
      } else { //cancel
        console.log("clicked on", responseIndex);
      }
    }, "Delete", ['Cancel', 'Confirm']);
    // let id = ev.currentTarget.getAttribute("data-id");
    // console.log(id);
    // let buttons = ["Confirm", "Cancel"];
    // let p = ev.currentTarget;

    // navigator.notification.confirm("Are you sure you want to delete?",
    //   (responseIndex) => {
    //     app.deleteReminder(p);
    //   p.innerHTML =  buttons[responseIndex - 1];
    // }, buttons)


    // navigator.notification.confirm(message, confirmCallback, [title], [buttonLabels])

    //document.querySelector(".overlay").style.display = "block";
  },

  // hideModal: () => {
  //   document.querySelector(".overlay").style.display = "none";
  // },

  /*****************************   CREATE REMINDER   *******************************/

  createReminderlist: () => {
    cordova.plugins.notification.local.getAll(function (notifications) {
      console.log(notifications);
      notifications.forEach((note) => {
        console.log("Note:", note);
        let container = document.getElementById("container");
        //container.innerHTML = ""; //empty page
        //let notes = note,
        //docFrag = document.createDocumentFragment();
        let listContainer = document.querySelector(".list-container");


        //console.log("This is the ID" + note.id);
        //notes.forEach((note) => {
        let listItem = document.createElement("li"),
          //title = document.createElement("h2"),
          deleteBtn = document.createElement("button");

          let p = document.createElement('p');
          p.textContent = note.data;

        listItem.setAttribute("class", "list-item");
        console.log("note data", note.data);
        //listItem.textContent = note.data;
        //title.textContent = note.title;
        //title.setAttribute("class", "title");
        deleteBtn.textContent = "delete";
        deleteBtn.setAttribute("class", "deleteBtn");
        deleteBtn.setAttribute("data-id", note.id); // use for yes button as well 
        deleteBtn.addEventListener("click", app.showConfirm);

        listItem.appendChild(p);
        listItem.appendChild(deleteBtn);
        listContainer.appendChild(listItem);




        container.appendChild(listContainer);
      })
    })
  },

  /*****************************   DELETE REMINDER  *******************************/
  deleteReminder: (p) => {
    //console.log("yes click ev is", ev, ev.currentTarget);
    console.log("parent elemnt is", p.parentElement);
    li = p.parentElement;
    li.remove(li.selectedIndex);
    let targetElement = p;
    id = targetElement.getAttribute("data-id");
    console.log("p in delete is", p);
    cordova.plugins.notification.local.cancel(id, function () {
      //cordova.plugins.notification.local.on("clear", function(notification) {
      //alert("cleared");
      // app.createReminderlist();
      //app.addNote();
      //   let container = document.getElementById("container");
      // container.innerHTML = "";
      //app.getNotification();
      //app.createReminderlist();
      console.log("ID: " + id + " has been deleted");

    });
    // OLD 
    // deleteReminder: (ev) => {
    //   let targetElement = ev.currentTarget,
    //     id = targetElement.getAttribute("data-id");
    //   cordova.plugins.notification.local.clear(id, function (notification) {
    //  //   app.getNotification();
    //     //cordova.plugins.notification.local.on("clear", function(notification) {
    //      alert("cleared: " + notification.id);




    //app.hideModal();
    //app.getNotification();
    // let container = document.getElementById("container");
    // container.innerHTML = "";
    //app.createReminderlist();
    // app.getNotification(); // issue : duplicates reminder list

  },


  

};

app.init();