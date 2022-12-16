function Show({ when, children }) {
  if (!when) {
    return null;
  }
  return children;
}

export { Show };
