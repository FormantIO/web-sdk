import { TextField } from "../../main";
import React, { FC } from "react";

interface ITextinputProps {
  jsonSchemaObject: any;
  currentStateObject: any;
  property: string;
}

export const TextInput: FC<ITextinputProps> = ({
  jsonSchemaObject,
  currentStateObject,
  property,
}) => {
  return (
    <TextField
      type="text"
      key={jsonSchemaObject.properties[property].title}
      sx={{ marginBottom: "16px" }}
      fullWidth={true}
      value={currentStateObject[jsonSchemaObject.properties[property].title]}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
        jsonSchemaObject.title in currentStateObject
          ? (currentStateObject[jsonSchemaObject.title] = {
              ...currentStateObject[jsonSchemaObject.title],
              [jsonSchemaObject.properties[property].title]: ev.target.value,
            })
          : (currentStateObject[jsonSchemaObject.properties[property].title] =
              ev.target.value);
      }}
      label={
        jsonSchemaObject.properties[property].title[0].toUpperCase() +
        jsonSchemaObject.properties[property].title.slice(1)
      }
      variant="filled"
    />
  );
};