import React, { useContext, useState } from 'react';
import { DEFAULT_GROUP_NAME } from '../../manager/track/TracksManager';
import { prepareFileName } from '../../util/Utils';
import { saveEmptyTrack } from '../../manager/track/SaveTrackManager';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@mui/material/DialogTitle';
import dialogStyles from '../dialog.module.css';
import DialogContent from '@mui/material/DialogContent';
import { Button, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import AppContext from '../../context/AppContext';

export default function AddFolderDialog({ trackGroup, setOpenAddFolderDialog }) {
    const ctx = useContext(AppContext);

    const [folderNameError, setFolderNameError] = useState('');
    const [folderName, setFolderName] = useState('');

    function isFolderExist(name) {
        return trackGroup.subfolders.some((folder) => folder.name === name);
    }

    function validationFolderName(name) {
        if (!name || name === '' || name.trim().length === 0) {
            setFolderNameError('Empty folder name.');
        } else if (isFolderExist(name)) {
            setFolderNameError('Folder already exists.');
        } else {
            setFolderNameError('');
        }
    }

    async function addFolder() {
        let folderPart;
        if (trackGroup.fullName === DEFAULT_GROUP_NAME) {
            folderPart = '';
        } else {
            folderPart = `${trackGroup.fullName}/`;
        }
        const newFolderName = `${folderPart}${prepareFileName(folderName)}`;
        saveEmptyTrack(newFolderName, ctx).then();
        setOpenAddFolderDialog(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFolder().then();
        }
    };

    return (
        <Dialog open={true} onClose={() => setOpenAddFolderDialog(false)}>
            <DialogTitle className={dialogStyles.title}>Add new folder</DialogTitle>
            <DialogContent className={dialogStyles.content}>
                <TextField
                    sx={{
                        '& label.Mui-focused': {
                            color: 'var(--svg-icon-color)',
                        },
                        '& .MuiFilledInput-underline:after': {
                            borderBottomColor: 'var(--svg-icon-color)',
                        },
                    }}
                    autoFocus
                    label={'Name:'}
                    onChange={(e) => {
                        const name = e.target.value;
                        validationFolderName(name);
                        setFolderName(name);
                    }}
                    id="se-add-folder-input"
                    type="folderName"
                    fullWidth
                    error={folderNameError !== ''}
                    helperText={folderNameError !== '' ? folderNameError : ' '}
                    variant="filled"
                    value={folderName ? folderName : ''}
                    onKeyDown={(e) => handleKeyPress(e)}
                ></TextField>
            </DialogContent>
            <DialogActions>
                <Button className={dialogStyles.button} onClick={() => setOpenAddFolderDialog(false)}>
                    Cancel
                </Button>
                <Button id="se-add-folder-submit" className={dialogStyles.button} onClick={() => addFolder()}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
