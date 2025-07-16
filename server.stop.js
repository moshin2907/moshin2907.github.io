const { exec } = require('child_process');
const os = require('os');

function stopServer() {
    const platform = os.platform();
    const PORT = process.env.PORT || 3000;

    console.log(`Attempting to stop server on port ${PORT}...`);

    let command;

    if (platform === 'win32') {
        // Windows command to find and kill process on port
        command = `netstat -ano | findstr :${PORT} | findstr LISTENING`;
    } else {
        // Unix/Linux/Mac command to find and kill process on port
        command = `lsof -ti:${PORT}`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`No process found running on port ${PORT} or error occurred:`, error.message);
            return;
        }

        if (!stdout.trim()) {
            console.log(`No process found running on port ${PORT}`);
            return;
        }

        if (platform === 'win32') {
            // Parse Windows netstat output to get PID
            const lines = stdout.trim().split('\n');
            const pids = [];

            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 5) {
                    const pid = parts[parts.length - 1];
                    if (pid && !isNaN(pid)) {
                        pids.push(pid);
                    }
                }
            });

            if (pids.length === 0) {
                console.log(`No process found running on port ${PORT}`);
                return;
            }

            // Kill each process
            pids.forEach(pid => {
                exec(`taskkill /F /PID ${pid}`, (killError, killStdout, killStderr) => {
                    if (killError) {
                        console.error(`Error killing process ${pid}:`, killError.message);
                    } else {
                        console.log(`Successfully killed process ${pid} on port ${PORT}`);
                    }
                });
            });

        } else {
            // Unix/Linux/Mac - stdout contains PIDs directly
            const pids = stdout.trim().split('\n').filter(pid => pid.trim());

            if (pids.length === 0) {
                console.log(`No process found running on port ${PORT}`);
                return;
            }

            // Kill each process
            pids.forEach(pid => {
                exec(`kill -9 ${pid}`, (killError, killStdout, killStderr) => {
                    if (killError) {
                        console.error(`Error killing process ${pid}:`, killError.message);
                    } else {
                        console.log(`Successfully killed process ${pid} on port ${PORT}`);
                    }
                });
            });
        }
    });
}

// Alternative method using fkill package (requires installation)
function stopServerWithFkill() {
    try {
        const fkill = require('fkill');
        const PORT = process.env.PORT || 3000;

        fkill(`:${PORT}`, { force: true })
            .then(() => {
                console.log(`Successfully stopped server on port ${PORT}`);
            })
            .catch(err => {
                console.log(`No process found on port ${PORT} or error occurred:`, err.message);
            });
    } catch (error) {
        console.log('fkill package not installed. Using native approach...');
        stopServer();
    }
}

// Main execution
if (require.main === module) {
    console.log('Server Stop Script');
    console.log('==================');

    // Try fkill first (cleaner approach), fallback to native
    stopServerWithFkill();

    // Also provide a timeout to ensure the script doesn't hang
    setTimeout(() => {
        console.log('Script completed');
        process.exit(0);
    }, 3000);
}

module.exports = { stopServer, stopServerWithFkill };