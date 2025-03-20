
export const endpoints = {
    auth: {
      register: '/auth/register/',
      login: '/auth/login/',
      refreshToken: '/auth/refresh-token/',
      logout: '/auth/logout/',
      forgotPassword: '/auth/forgot-password/',
      resetPassword: '/auth/reset-password/',
    },
    user: {
      profile: '/users/profile/',
      updateProfile: '/users/profile/',
      notifications: '/users/notification/',
    },

    education: {
      schools: '/edudata/schools/',
      userSchools: '/edudata/schools/user-schools/',
      schoolDetails: (id) => `/edudata/schools/${id}/`,
      schoolCreate: '/edudata/schools/create/',
      schoolLocationCreate: '/edudata/school-locations/create/',
      schoolAlumniCreate: '/edudata/schools/create-alumni/',
      schoolContactCreate: '/edudata/schools/create-contact/',
      schoolGovernmentDataCreate: '/edudata/schools/create-government-data/',
      schoolFeesCreate: '/edudata/schools/create-fees/',
      schoolAdmissionPolicyCreate: '/edudata/schools/create-school-admission-policy/',
      schoolImagesUpload: '/edudata/schools/images-upload/'
    },

    locations: {
      provinces: '/edudata/provinces/',
      districts: (provinceCode) => `/edudata/districts/?province_code=${provinceCode}`,
      sectors: (districtCode) => `/edudata/sectors/?district_code=${districtCode}`,
      cells: (sectorCode) => `/edudata/cells/?sector_code=${sectorCode}`,
      villages: (cellCode) => `/edudata/villages/?cell_code=${cellCode}`
    },
    // Add more endpoints as needed based on your backend API
  };