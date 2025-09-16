import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Document,
  Person,
  ReviewerStep,
  TemplateData,
  Templates,
} from "../types/types";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import type { AuthRequest, AuthResponse } from "../types/authTypes";
import { API_BASE_URL } from "../constants";
import { createAuthHeaders } from "../utils/createAuthHeaders";

export const loginUser = createAsyncThunk<
  AuthResponse,
  AuthRequest,
  { rejectValue: string }
>("auth/loginUser", async (authData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    // tokenManager.setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchTemplates = createAsyncThunk<
  Templates,
  void,
  { rejectValue: string }
>("doc/fetchTemplates", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      headers: createAuthHeaders(),
    });
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
    const response = await fetch(`${API_BASE_URL}/personal`, {
      headers: createAuthHeaders(),
    });
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

export const setRoute = createAsyncThunk<
  Document,
  { documentId: string; reviewers: ReviewerStep[] },
  { rejectValue: string }
>("routes/setRoute", async ({ documentId, reviewers }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/documents/${documentId}/route`,
      {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({ reviewers }),
      },
    );
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const approveDocument = createAsyncThunk<
  Document,
  string,
  { rejectValue: string }
>("routes/approveDocument", async (documentId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/documents/${documentId}/approve`,
      {
        method: "POST",
        headers: createAuthHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// export const setRoute = createAsyncThunk<
//   Document,
//   { documentId: string; reviewers: ReviewerStep[] }
// >("routes/setRoute", async ({ documentId, reviewers }) => {
//   const res = await axios.post(`api/documents/${documentId}/route`, {
//     reviewers,
//   });
//   return res.data as Document;
// });

// export const approveDocument = createAsyncThunk<Document, string>(
//   "routes/approveDocument",
//   async (documentId) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/documents/${documentId}/approve`,
//     );
//     return res.data as Document;
//   },
// );
