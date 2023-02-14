import { useEffect, useState } from "react";


const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [maxLenghtError, setMaxLenghtError] = useState(false);
  const [inputValid, setInputValid] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case "MaxLenght":
          value.lenght > validations[validation]
            ? setMaxLenghtError(true)
            : setMaxLenghtError(false);
          break;
        case "isEmpty":
          value ? setEmpty(false) : setEmpty(true);
          break;
      }
    }
  }, [value]);

  useEffect(() => {
    if (isEmpty || maxLenghtError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, maxLenghtError]);

  return {
    isEmpty,
    maxLenghtError,
    inputValid,
  };
};

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = (e) => {
    setDirty(true);
  };

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid,
  };
};

function Decoder() {
  function VariableId() {
    const liveMatches = [];
    fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json"
    )
      .then(function (response) {
        console.log(response.status);
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          for (const product of data.Results) {
            liveMatches.push({
              DataType: product.DataType,
              Description: product.Description,
              GroupName: product.GroupName,
              ID: product.ID,
              Name: product.Name,
            });
          }

          console.log(data);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
    return liveMatches;
  }

  function Api() {
    const Id = VariableId();
    console.log(Id);
    let vinField = document.querySelector('input[name="formVin"]');
    let listItems = document.querySelector("p");
    fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/" +
        vinField.value +
        "?format=json"
    )
      .then(function (response) {
        console.log(response.status);
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          listItems.innerHTML = "";
          for (const product of data.Results) {
            if (product.Value !== null && product.Value !== "") {
              const listItem = document.createElement("ol");
              listItem.setAttribute("id", product.VariableId);
              listItem.appendChild(
                document.createElement("strong")
              ).textContent = product.Variable + "-    " + product.Value;
              listItems.appendChild(listItem);
            }
          }

          console.log(data);
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  const formVin = useInput("", { isEmpty: true, maxLenght: 17 });

  
  return (
    <div className="App">
      <div className="MainContainer">
        <div className="mainVinForm">
          <form name="Decoder">
            <h2>Расшифруй свой Vin</h2>
            {formVin.isDirty && formVin.isEmpty && (
              <div className="allert" style={{ color: "red" }}>
                Поле не может быть пустым
              </div>
            )}
            {formVin.isDirty && formVin.maxLenghtError && (
              <div className="allert" style={{ color: "red" }}>
                Слишком длинный VIN
              </div>
            )}
            <input
              className="inputVin"
              onBlur={(e) => formVin.onBlur(e)}
              onChange={(e) => formVin.onChange(e)}
              value={formVin.value}
              id="vin"
              name="formVin"
              placeholder="17-charachter VIN number"
              type="text"
              maxlength="17"
            />
          </form>
        </div>
        <button
          onClick={Api}
          type="submit"
          class="infoVin"
          disabled={!formVin.inputValid}
        >
          Расшифровать VIN
        </button>
      </div>
      <p className="variables" name="items" />
    </div>
  );
}


export default Decoder;
