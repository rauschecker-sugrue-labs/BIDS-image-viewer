import React, { useEffect, useState } from "react";
// import datadict from "../data.json";

export const getInitialSelections = (data) => {
  return Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    let firstValue;
    if (Array.isArray(value)) {
      firstValue = value[0];
    } else if (typeof value === "object") {
      // If it's an object, take the first value of the first key
      firstValue = value[Object.keys(value)[0]][0];
    }
    return { ...acc, [key]: firstValue };
  }, {});
};

export const DynamicDropdowns = ({
  data,
  visibleFields,
  onSelectionChange,
}) => {
  const initialSelections = getInitialSelections(data);
  const [selections, setSelections] = useState(initialSelections);
  const handleChange = (key, event) => {
    const value = event.target.value;
    const newSelections = { ...selections, [key]: value };
    setSelections(newSelections);
    onSelectionChange(newSelections); // Call the callback with all selections
  };

  const renderOptions = (options) => {
    if (Array.isArray(options)) {
      return options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
    } else {
      return Object.keys(options).map((option) => (
        <optgroup key={option} label={option}>
          {renderOptions(options[option])}
        </optgroup>
      ));
    }
  };

  return (
    <div>
      {Object.keys(data).map(
        (key) =>
          visibleFields[key] && (
            <div key={key}>
              <label>{key}:</label>
              <select
                value={selections[key] || ""}
                onChange={(e) => handleChange(key, e)}
              >
                {renderOptions(data[key])}
              </select>
            </div>
          )
      )}
    </div>
  );
};

// {
//   "DTI": ["Trace", "FA", "MD"],
//   "Structural": ["T1w", "T2w"],
//   "RSI": ["F0res", "F0hind", "N0res", "N0hind", "NDres", "NDhind"]
// },
//   [
//   "FA",
//   "MD",
//   "T1w",
//   "T2w",
//   "F0res",
//   "F0hind",
//   "N0res",
//   "N0hind",
//   "NDres",
//   "NDhind"
// ]
// "Tractography": ["AFQ tractogram", "Full tractogram"]

export const SubjectDropdown = ({ onSubjectChange }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    // Fetch the subjects from the server
    fetch("/subjects")
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
        // If subjects are available, select a random subject as the default value
        // if (data.length > 0) {
        //   const randomSubject = data[Math.floor(Math.random() * data.length)];
        //   setSelectedSubject(randomSubject);
        //   onSubjectChange(randomSubject); // Call the callback with the selected subject
        // }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (event) => {
    const subject = event.target.value;
    onSubjectChange(subject); // Call the callback with the selected subject
  };

  return (
    <select value={selectedSubject} onChange={handleChange}>
      <option value="">Select a subject</option>
      {subjects.map((subject) => (
        <option key={subject} value={subject}>
          {subject.replace("sub-NDARINV", "")}
        </option>
      ))}
    </select>
  );
};
