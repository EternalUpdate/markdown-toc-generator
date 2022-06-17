const form = document.getElementById("input-form");

form.addEventListener("submit", processText);

function processText(event) {
  // prevents the form from reloading on submit
  event.preventDefault();

  // get input
  let inputValue = document.getElementById("markup-input-box").value;

  // process input
  let inputArray = inputValue.split("\n");
  let outputArray = ["# Table of Contents\n"];

  // add headers
  for (let i = 0; i < inputArray.length; i++) {
    let line = inputArray[i];

    if (isHeader(line)) {
      line = formatLine(line);
      outputArray.push(line);
    }
  }

  // shove into a string so it looks neat
  let outputValue = "";
  for (let i = 0; i < outputArray.length; i++) {
    outputValue = outputValue + outputArray[i];
  }

  // show on page
  document.getElementById("output").innerHTML = outputValue;
}

/**
 * Takes a string and returns the header depth.
 * Ex. "# A header" -> 1
 * "### Other header" -> 3
 * "No header" -> 0
 * "#Incorrect header" -> 0
 *
 * @param {*} string input string
 * @param {*} max_depth maximum markdown depth, 6 by default
 * @param {*} headerDepth 0 by default and incremented recursively
 * @returns the header depth
 */
function getHeaderDepth(string, max_depth = 6, headerDepth = 0) {
  // no header or reached end of string
  if (string.charAt(0) != "#" || headerDepth + 1 > string.length) {
    return headerDepth;
  }

  // reached the end of the header
  if (string.charAt(headerDepth + 1) == " ") {
    return headerDepth + 1;
  }

  // the header continues
  if (string.charAt(headerDepth + 1) == "#") {
    return getHeaderDepth(string, max_depth - 1, headerDepth + 1);
  } else {
    return headerDepth;
  }
}

function isHeader(string) {
  return getHeaderDepth(string) > 0;
}

function removeHeaderPounds(string) {
  const headerDepth = getHeaderDepth(string);
  let headerPounds = " ";
  for (let i = 0; i < headerDepth; i++) {
    headerPounds = "#" + headerPounds;
  }
  return string.replace(headerPounds, "");
}

function addTabs(string, headerDepth) {
  for (let j = 1; j < headerDepth; j++) {
    string = "\t" + string;
  }

  return string;
}

function formatLine(line) {
  let headerDepth = getHeaderDepth(line);

  // stop if it's not a header
  if (headerDepth == 0) {
    return line;
  }

  // keep only the text
  line = removeHeaderPounds(line);

  // figure out which format is needed
  let format = document.querySelector(
    "input[name='type-select']:checked"
  ).value;

  // format
  switch (format) {
    case "GitHub":
      line = "[" + line + "]";
      break;
    case "BearApp":
      line = "[[/" + line + "]]";
      break;
  }

  line = addTabs(line, headerDepth) + "\n";

  return line;
}
