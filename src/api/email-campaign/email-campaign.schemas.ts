import * as Yup from "yup";

export const newEmailcampaignSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    campaignName: Yup.string().required("Campaign name is required"),
    from: Yup.string().required("From is required"),
    replyToEmail: Yup.string()
      .email("Must be a valid email")
      .required("Reply-to email address is required"),

    // Footer Section
    organizer: Yup.string().required("Organizer is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().nullable(), // Optional
    postalCode: Yup.string().nullable(), // Optional

    country: Yup.string().required("Country is required"),

    // Social media links (optional but must be valid URLs if provided)
    tiktokLink: Yup.string().url("Must be a valid URL").nullable(),
    facebookLink: Yup.string().url("Must be a valid URL").nullable(),
    instagramLink: Yup.string().url("Must be a valid URL").nullable(),
    twitterLink: Yup.string().url("Must be a valid URL").nullable(),

    // File validation (optional file upload, with size and format validation)
    logoFile: Yup.mixed<File>()
      .test("fileSize", "File size is too large", (value) => {
        return !value || (value && value.size <= 1024 * 1024); // 1MB limit
      })
      .test("fileFormat", "Unsupported Format", (value) => {
        return (
          !value || (value && ["image/jpeg", "image/png"].includes(value.type))
        );
      }),
  }),
});
