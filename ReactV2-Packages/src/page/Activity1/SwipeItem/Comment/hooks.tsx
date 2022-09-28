import React, { useMemo } from 'react';

export const useComment = (props) => {
  return useMemo(() => {
    const onShowComment = () => props.setShowComment((param) => !param)
    return {
      onShowComment
    }
  }, [])
}