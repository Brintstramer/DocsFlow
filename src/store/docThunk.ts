import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Person, TemplateData, Templates } from "../types/types";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

export const fetchTemplates = createAsyncThunk<
  Templates,
  void,
  { rejectValue: string }
>("doc/fetchTemplates", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:3000/templates");
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchPersonal = createAsyncThunk<
  Person[],
  void,
  { rejectValue: string }
>("doc/fetchPersonal", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:3000/personal");
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const genWordDoc = createAsyncThunk<
  void,
  { templateFile: string; data: TemplateData; baseName?: string },
  { rejectValue: string }
>(
  "doc/genWordDoc",
  async ({ templateFile, data, baseName }, { rejectWithValue }) => {
    try {
      if (!templateFile) {
        throw new Error("Нужно выбрать шаблон!");
      }
      const response = await fetch(templateFile);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить шаблон: ${response.status}`);
      }
      console.log(data);
      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(data);

      const blob = doc.getZip().generate({ type: "blob" });

      const safeName = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
      const finalName = baseName
        ? `${safeName(baseName)}.docx`
        : "document.docx";

      saveAs(blob, finalName);
      return;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
