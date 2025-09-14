export const formatZodError = (error) => {
    return error.issues.map((issue) => {
        const field = issue.path.join(".");
        const message = issue.code === "invalid_type" && issue.message.includes("Required")
            ? `${field} is required.`
            : issue.message;
        return {
            field: field || "",
            message,
        };
    });
};
