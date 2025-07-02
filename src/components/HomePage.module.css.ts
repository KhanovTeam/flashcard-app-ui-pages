import { style } from '@vanilla-extract/css';

export const layout = style({
    display: 'flex',
    height: '100vh',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

export const sidebar = style({
    width: '200px',
    backgroundColor: '#1c1c1c',
    color: 'white',
    padding: '16px',
    fontWeight: 'bold',
});

export const main = style({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
});

export const header = style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e1e5e9',
    padding: '16px',
});

export const content = style({
    padding: '32px',
    backgroundColor: '#f3f0f2',
    height: '100%',
    overflowY: 'auto',
});
