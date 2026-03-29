import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchMyProfile = createAsyncThunk(
  "/api/profile/fetchMyProfile",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/profile/me");
      return res.data.profile;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const fetchMySettings = createAsyncThunk(
  "/api/profile/fetchMySettings",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/profile/settings");
      return res.data.settings;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  "/api/profile/updateMyProfile",
  async (payload, thunkAPI) => {
    try {
      const res = await api.patch("/api/profile/me", payload);
      return res.data.profile;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const updateMySettings = createAsyncThunk(
  "/api/profile/updateMySettings",
  async (payload, thunkAPI) => {
    try {
      const res = await api.patch("/api/profile/settings", payload);
      return res.data.settings;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update settings"
      );
    }
  }
);

export const fetchMyAddresses = createAsyncThunk(
  "/api/profile/fetchMyAddresses",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/profile/addresses");
      return res.data.addresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

export const addAddress = createAsyncThunk(
  "/api/profile/addAddress",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/api/profile/addresses", payload);
      return res.data.addresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "/api/profile/updateAddress",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/profile/addresses/${id}`, data);
      return res.data.addresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "/api/profile/deleteAddress",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/api/profile/addresses/${id}`);
      return res.data.addresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  "/api/profile/setDefaultAddress",
  async (id, thunkAPI) => {
    try {
      const res = await api.patch(`/api/profile/addresses/${id}/default`);
      return res.data.addresses;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to set default address"
      );
    }
  }
);

const initialState = {
  profile: null,
  settings: null,
  addresses: [],

  loadingProfile: false,
  loadingSettings: false,
  loadingAddresses: false,

  savingProfile: false,
  savingSettings: false,
  savingAddress: false,

  errorProfile: "",
  errorSettings: "",
  errorAddresses: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loadingProfile = true;
        state.errorProfile = "";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.errorProfile = action.payload || "Failed to fetch profile";
      })

      .addCase(fetchMySettings.pending, (state) => {
        state.loadingSettings = true;
        state.errorSettings = "";
      })
      .addCase(fetchMySettings.fulfilled, (state, action) => {
        state.loadingSettings = false;
        state.settings = action.payload;
      })
      .addCase(fetchMySettings.rejected, (state, action) => {
        state.loadingSettings = false;
        state.errorSettings = action.payload || "Failed to fetch settings";
      })

      .addCase(fetchMyAddresses.pending, (state) => {
        state.loadingAddresses = true;
        state.errorAddresses = "";
      })
      .addCase(fetchMyAddresses.fulfilled, (state, action) => {
        state.loadingAddresses = false;
        state.addresses = action.payload || [];
      })
      .addCase(fetchMyAddresses.rejected, (state, action) => {
        state.loadingAddresses = false;
        state.errorAddresses = action.payload || "Failed to fetch addresses";
      })

      .addCase(updateMyProfile.pending, (state) => {
        state.savingProfile = true;
        state.errorProfile = "";
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.savingProfile = false;
        state.profile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.savingProfile = false;
        state.errorProfile = action.payload || "Failed to update profile";
      })

      .addCase(updateMySettings.pending, (state) => {
        state.savingSettings = true;
        state.errorSettings = "";
      })
      .addCase(updateMySettings.fulfilled, (state, action) => {
        state.savingSettings = false;
        state.settings = action.payload;
      })
      .addCase(updateMySettings.rejected, (state, action) => {
        state.savingSettings = false;
        state.errorSettings = action.payload || "Failed to update settings";
      })

      .addCase(addAddress.pending, (state) => {
        state.savingAddress = true;
        state.errorAddresses = "";
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.savingAddress = false;
        state.addresses = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.savingAddress = false;
        state.errorAddresses = action.payload || "Failed to add address";
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export const selectProfile = (state) => state.profile.profile;
export const selectProfileSettings = (state) => state.profile.settings;
export const selectProfileAddresses = (state) => state.profile.addresses;

export const selectProfileLoading = (state) => state.profile.loadingProfile;
export const selectSettingsLoading = (state) => state.profile.loadingSettings;
export const selectAddressesLoading = (state) => state.profile.loadingAddresses;

export const selectProfileSaving = (state) => state.profile.savingProfile;
export const selectSettingsSaving = (state) => state.profile.savingSettings;
export const selectAddressSaving = (state) => state.profile.savingAddress;

export const selectProfileError = (state) => state.profile.errorProfile;
export const selectSettingsError = (state) => state.profile.errorSettings;
export const selectAddressesError = (state) => state.profile.errorAddresses;

export default profileSlice.reducer;