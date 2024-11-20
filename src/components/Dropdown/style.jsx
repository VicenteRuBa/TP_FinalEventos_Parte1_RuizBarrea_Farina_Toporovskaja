export const styles = {
    selectContainer: {
      position: 'relative',
      width: '100%',
      marginBottom: '16px',
    },
  
    select: {
      width: '100%',
      padding: '16px',
      color: '#EFE5FF',
      marginBottom: '16px',
      borderRadius: '10px',
      backgroundColor: '#3D3D3D',
      border: '0px',
      borderBottom: '1px solid black',
      outline: 'none',
      boxSizing: 'border-box',
      appearance: 'none',
      cursor: 'pointer',
    },
  
    label: {
      position: 'absolute',
      left: '16px',
      top: '-10px',
      backgroundColor: '#3D3D3D',
      padding: '0 4px',
      color: '#EFE5FF',
      fontSize: '12px',
    },
  
    arrow: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #EFE5FF',
      pointerEvents: 'none',
    },
  
    error: {
      borderColor: '#ff4444',
      borderWidth: '1px',
      borderStyle: 'solid',
    },
  
    errorMessage: {
      color: '#ff4444',
      fontSize: '12px',
      marginTop: '4px',
      marginLeft: '16px',
    },
  
    option: {
      backgroundColor: '#3D3D3D',
      color: '#EFE5FF',
      padding: '8px 16px',
    }
  };