import React, { memo, useMemo, useState } from '../../react/packages/react'

 const ComponentInput = memo(({notifyFatherChange}) => {

  const [ value, setValue ] = useState('');
  const handerChange = useMemo(() => (e) => {
    setValue(e.target.value);
    notifyFatherChange && notifyFatherChange(e.target.value)
  }, [])
  return  <input  value={value}  onChange={ (e)=> handerChange(e) } />
})

export default ComponentInput