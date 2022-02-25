function interpretServerErrors(result) {
  if (!result.errors) {
    return result.message;
  }
  if (Array.isArray(result.errors) && !result.errors.length) {
    return result.message;
  }
  return result.errors;
}

export default { interpretServerErrors };
