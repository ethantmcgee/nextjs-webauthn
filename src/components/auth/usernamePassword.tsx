import {Box, Button, FormControl, FormLabel, Link, TextField} from "@mui/material";

export default function UsernamePassword() {
    return (
        <Box
            component="form"
            className="mb-4 pl-4 pr-4"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
            }}
        >
            <FormControl fullWidth>
                <FormLabel htmlFor="email">Username / Email</FormLabel>
                <TextField id="email" type="text" name="email" autoComplete="email" placeholder="your@email.com" fullWidth />
            </FormControl>

            <FormControl fullWidth>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Link
                        component="button"
                        variant="body2"
                        sx={{ alignSelf: 'baseline' }}
                    >
                        Forgot your password?
                    </Link>
                </Box>
                <TextField id="password" type="password" name="password" autoComplete="password" placeholder="••••••" fullWidth />
            </FormControl>
            <Button
                type="submit"
                fullWidth
                variant="contained"
            >
                Sign in
            </Button>
        </Box>
    );
}