let app = {
  // Application Constructor
  pages: [],
  //notifications: [],

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
      console.log(notification.data);
    });
    cordova.plugins.notification.local.on("trigger", function (notification) {
      //added to the notification center on the date to trigger it.
      // navigator.notification.alert("triggered: " + notification.id);
      console.log(notification.id);
    });

  },
  addNote: function () {
    let listContainer = document.querySelector(".list-container");
    let listItem = document.createElement("li");

    let title = document.getElementById("title").value;
    let message = document.getElementById("message").value;
    let date = document.getElementById("date").value;

    let h2 = document.createElement('h2');
    h2.textContent = title;

    console.log('title is:', title, "h2 is", h2);

    listItem.appendChild(h2);
    listContainer.appendChild(listItem);
    deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    listItem.appendChild(deleteBtn);

    console.log("li is", listContainer);

    let year = date[0] + date[1] + date[2] + date[3];
    console.log(year);
    let day = date[8] + date[9];
    let month = date[5] + date[6];
    let time = document.getElementById("time").value;
    let hour = time[0] + time[1];
    console.log(hour);
    let min = time[3] + time[4];

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
    let inOneMin = new Date();
    inOneMin.setMinutes(inOneMin.getMinutes() + 1);
    let id = new Date().getMilliseconds();
    console.log(inOneMin);
    console.log(date, time);
    let DateTime = luxon.DateTime;
    let dt = DateTime.local(year, month, day, hour, min); //pass year, month, day, hour, minute, gives milliseconds 
    console.log(dt.ts);

    let noteOptions = {
      id: id,
      title: title,
      text: message,
      at: inOneMin,
      badge: 1,
      data: {
        prop: "prop value",
        num: 42
      }
    };

    cordova.plugins.notification.local.schedule(noteOptions);

    // clearing input fields
    id = "";
    title = "";
    date = "";
    time = "";

    navigator.notification.alert("Added notification id " + id);

    //app.getNotification();

    //app.createReminderlist();

   // cordova.plugins.notification.local.cancel(id, function () {

    //});
    cordova.plugins.notification.local.isPresent(id, function (present) {

    });

    app.goHomepage();

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
    // let id = ev.currentTarget.getAttribute("data-id");
    // console.log(id);
    // let buttons = ["Confirm", "Cancel"];
    let p = ev.currentTarget;
    navigator.notification.confirm("Are you sure you want to delete?",
      (responseIndex) => {
        app.deleteReminder(p);
      //   p.innerHTML =  buttons[responseIndex - 1];
      // }, buttons)

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
      title = document.createElement("h2"),
      deleteBtn = document.createElement("button");

    listItem.setAttribute("class", "list-item");
    title.textContent = note.title;
    title.setAttribute("class", "title");
    deleteBtn.textContent = "delete";
    deleteBtn.setAttribute("class", "deleteBtn");
    deleteBtn.setAttribute("data-id", note.id); // use for yes button as well 
    deleteBtn.addEventListener("click", app.showConfirm);

    listItem.appendChild(title);
    listItem.appendChild(deleteBtn);
    listContainer.appendChild(listItem);
  

    

    container.appendChild(listContainer);
  })
  })
  },

  /*****************************   DELETE REMINDER  *******************************/
  deleteReminder: (p) => {
    //console.log("yes click ev is", ev, ev.currentTarget);
    let targetElement = p,
      id = targetElement.getAttribute("data-id");
    cordova.plugins.notification.local.clear(id, function () {
      //cordova.plugins.notification.local.on("clear", function(notification) {
      alert("cleared");
      app.createReminderlist();
      //app.addNote();
      //   let container = document.getElementById("container");
      // container.innerHTML = "";
      //app.getNotification();
      //app.createReminderlist();


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

  getNotification: () => {
    cordova.plugins.notification.local.getAll(function (notifications) {
      console.log(notifications);
      notifications.forEach((note) => {})
      //app.notifications = notifications;
    });
  }

};

app.init();