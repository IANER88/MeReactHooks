type DetermineProps = {
  condition: boolean;
  children: JSX.Element;
  fallback?: JSX.Element;
}

const Determine = (props: DetermineProps): JSX.Element => {
  const {
    condition = true,
    children,
    fallback,
  } = props;
  if (fallback === undefined) {
    return (condition && children) as JSX.Element;
  }
  return (condition ? children : fallback)
}

export default Determine;