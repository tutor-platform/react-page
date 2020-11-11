import { FormControlLabel, Switch, Tooltip } from '@material-ui/core';
import VisibleIcon from '@material-ui/icons/Visibility';
import NonVisibleIcon from '@material-ui/icons/VisibilityOff';
import { useCell, useLang, useSetDraft } from '@react-page/core';
import React from 'react';

const DraftSwitch = ({ id, lang }: { id: string; lang?: string }) => {
  const node = useCell(id);
  const setDraft = useSetDraft();
  const currentLang = useLang();
  if (!node) {
    return null;
  }
  const theLang = lang ?? currentLang;
  const hasI18n = Boolean(node.isDraftI18n);
  const isDraft = node?.isDraftI18n?.[theLang] ?? node?.isDraft; // fallback to legacy
  const title = isDraft ? 'Content is hidden' : 'Content is visible';
  return node ? (
    <Tooltip title={title + (hasI18n ? ' in ' + theLang : '')}>
      <FormControlLabel
        style={{ marginRight: 5 }}
        labelPlacement="start"
        control={
          <Switch
            color="primary"
            checked={!isDraft}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDraft(id, !e.target.checked, theLang);
            }}
          />
        }
        label={
          isDraft ? (
            <NonVisibleIcon style={{ marginTop: 5 }} />
          ) : (
            <VisibleIcon style={{ marginTop: 5 }} />
          )
        }
      />
    </Tooltip>
  ) : null;
};

export default DraftSwitch;
