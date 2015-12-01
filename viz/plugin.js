

function loadData() {

  $.get("g6Inter.csv", function(data) {
    var csv = data;
    csv = $.csv.toArrays(csv);

    for (i = 0; i < csv[0].length; i ++){
      curString = i.toString().concat('_').concat(csv[0][i]);
      annotations[i.toString().concat('_').concat(csv[0][i])] = {start: csv[1][i], end: csv[2][i]};
      annotationNames.push(i.toString().concat('_').concat(csv[0][i]));
    }

    data_sets = csv[3];
    sourceDir = csv[4][0];

    addAnnot();
    loadFullCsv(data_sets);
  });
}

function loadFullCsv(data_sets) {

  $.get("out6.csv", function(data) {
    var csv = data;
    csv = $.csv.toArrays(csv);

// restructuring the data
    for (j = 0; j < csv[0].length; j ++) {
      fullFileUnfiltered[csv[0][j]] = [];
      csvNames.push([csv[0][j]]);
    }

    for (i = 1; i < csv.length; i ++) {
      for (j = 0; j < csv[0].length; j ++) {
        if (j != 0)
          fullFileUnfiltered[csv[0][j]].push(parseFloat(csv[i][j]));
        else
          fullFileUnfiltered[csv[0][j]].push(csv[i][j]);
      }
    }
    convertTime();
  });
}

function timeIndex(annot, start) {
    var num;
    if (start === 'start')
      num = annotations[annot].start;
    else
      num = annotations[annot].end;

    var curr = time[0];
    var saveIndex = 0;
    for (index = 0; index < time.length; index++){
        if (Math.abs(num - time[index]) < Math.abs(num - curr)) {
            curr = time[index];
            saveIndex = index;
        }
    }
    return saveIndex;
}


function convertTime() {
  var fullTime = 0;
  for (i = 0; i < fullFileUnfiltered['Time'].length; i++){
    fullTime = fullFileUnfiltered['Time'][i].split(':');
    var hour = parseFloat(fullTime[0]);
    var min = parseFloat(fullTime[1]);
    var sec = parseFloat(fullTime[2]);

    time.push(hour*60*60 + min*60 + sec);
  }
  calculateSkeleton();
}

// grab each Annotation and make an element for them
function fillBox () {
  var box = document.getElementById("test-text");
  var annot = document.getElementById("Annotation");
  var dataType = document.getElementById("dataType");

}

function getArray(annotation, dataType) {
  start = timeIndex(annotation, 'start');
  end = timeIndex(annotation, 'end');
  return fullFileUnfiltered[dataType].slice(start,end);
}

//Dan - compare what this spits out to what arrayAvg needs
function getKinectData(annotation, data1, data2) {
  start = timeIndex(annotation, 'start');
  end = timeIndex(annotation, 'end');
  x = fullFileUnfiltered[data1].slice(start,end);
  y = fullFileUnfiltered[data2].slice(start,end);

//filter out missing. push array of value pairs
  both = []
  for (i = 0; i < x.length; i++) {
      if (!isNaN(x[i]) && !isNaN(y[i])) {
      both.push([x[i],y[i]]);
    }
  }
  return both;
}

function getKinectDataSkel(annotation, data1) {
  start = timeIndex(annotation, 'start');
  end = timeIndex(annotation, 'end');
  q = fullFileUnfiltered[data1].slice(start,end);

//filter out missing. push array of value pairs
  both = []
  for (i = 0; i < q.length; i++) {
      if (!isNaN(q[i]) ) {
      both.push([q[i]]);
    }
  }
  return both;
}

// average the values of an array while excluding missing values
//Dan - change this so it can take result of getKinectData
function arrayAvg(arr) {
  var count = 0.0;
  var total = 0.0;
  for (i = 0; i < arr.length; i++){
    if (!isNaN(arr[i][0])){
      total += arr[i][0];
      count++;
    }
  }
  if (count == 0)
    return 0;
  else
    return total/count;
}

//run the average on x,y,z arrays and send them, also run the vis (button press) function.
//skeletonNames comes from Interface and lists joints to be included
function calculateSkeleton() {

  document.getElementById("Annotation").selectedIndex = 0;
  document.getElementById("VizType").selectedIndex = 0;
  visualize();
}
