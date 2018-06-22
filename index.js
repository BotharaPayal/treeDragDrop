
var dragElementSelected = null;
var Managers = [];

function dragStartFun(e) {
  // Target (this) element is the source node.
  dragElementSelected = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}

function dragOverFun(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function dragEnterFun(e) {
  // this / e.target is the current hover target.
}

function dragLeaveFun(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function dropFun(e) {
  // this/e.target is current target element.
  var ele2= this.parentNode.parentNode.parentNode;
  var ele3 = ele2.querySelectorAll('.dragElem');
  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragElementSelected != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    //alert(this.outerHTML);
    Array.prototype.forEach.call( ele3, function( node ) {
        node.parentNode.removeChild( node );
    });
    // ele3[0].parentNode.removeChild(ele3[0]);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);
    
  }
  this.classList.remove('over');
  return false;
}

function dragEndFun(e) {
  // this/e.target is the source node.
  this.classList.remove('over');
}

/**
 * this function will toggle the icon in case of expand and collapse
 * @param {*} obj 
 */
function toggleList(obj) {
    let ele = document.getElementById(obj);
    let uls = ele.getElementsByTagName('ul')
    let img = ele.getElementsByTagName('img');
    if(uls[0].style.display === 'none') {
        uls[0].style.display = 'block';
        img[0].setAttribute("src", "down.png");
    } else {
        uls[0].style.display = 'none';
        img[0].setAttribute("src", "right.png");
    }
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', dragStartFun, false);
  elem.addEventListener('dragenter', dragEnterFun, false)
  elem.addEventListener('dragover', dragOverFun, false);
  elem.addEventListener('dragleave', dragLeaveFun, false);
  elem.addEventListener('drop', dropFun, false);
  elem.addEventListener('dragend', dragEndFun, false);

}

/**
 * this function will read JSON data and generate list of
 * team members corresponding to their manager
 */
function getJSON() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let arr = JSON.parse(this.responseText)
            if(this.responseText.length) {

                var allEmpid = arr.map(function(obj) { return obj.eid; });

                // get all unique Employee ids to get the Managers list
                var uniqueEmployeeId = allEmpid.filter(function(v,i) { return allEmpid.indexOf(v) == i; });

                uniqueEmployeeId.forEach((element, index) => {
                    Managers[index] = arr.filter(item => item.eid === element)
                });

                var ul = document.createElement("ul");
                var elementList = ''
                for(var i =0; i< Managers.length; i++) {
                    elementList += `<li id="team${i+1}" onclick="toggleList('team${i+1}')">
                    <img src="right.png" class="icon-expand"/>
                        <span class="team-manager-name"> Manager ${i+1} </span>
                    </li>`

                }
                ul.insertAdjacentHTML('beforeend', elementList);

                var x = document.getElementById('drag-src')
                x.appendChild(ul)
            
            generateList()
        }
        }
    };

    xhttp.open("GET", "employee.json", true);
    xhttp.send();
}

/**
 * create and append child/team member to the manager elements and
 * add event handler for drag drop functionality
 */
function generateList() {
    
    var ulList=[];

    // for each manager create list of team members
    Managers.forEach(function(item, index) {
        var ul = document.createElement("ul");
        var ele = document.getElementById("team" + (index + 1))
        ele.appendChild(ul);

        for (var i = 0; i < item.length; i++)
        {
            var li = document.createElement("li");  
            li.className = "column";
            li.setAttribute('draggable', true);


            var a = document.createElement("a");
            a.innerHTML = "Member " + item[i].name;

            li.appendChild(a);
            ul.appendChild(li);
            ulList.push(ul);
        }

    })

    var cols = document.querySelectorAll('.column');
    [].forEach.call(cols, addDnDHandlers);

    //  set display to none for all team players list
    ulList.forEach(element => {
        element.style.display = 'none';
    });
    
}

getJSON();


