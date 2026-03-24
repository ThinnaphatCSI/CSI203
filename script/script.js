        // ฟังก์ชันสำหรับ toggle ขั้นตอน
        function toggleStep(element) {
            const header = element;
            const content = header.nextElementSibling;
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        }

        // ============================================
        // JavaScript Performance Monitor Tool
        // ============================================

        let monitoringInterval = null;
        let fpsInterval = null;
        let frameCount = 0;
        let lastFpsTime = performance.now();
        let currentFps = 0;
        let logs = [];

        function addLog(message, type = 'info') {
            const logContainer = document.getElementById('logContainer');
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${type}`;
            
            const timestamp = new Date().toLocaleTimeString();
            logEntry.textContent = `[${timestamp}] ${message}`;
            
            logContainer.appendChild(logEntry);
            logEntry.scrollIntoView({ behavior: 'smooth', block: 'end' });
            
            logs.push({ message, type, timestamp });
            
            while (logContainer.children.length > 50) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }

        function updateMetrics(metrics) {
            const domElement = document.getElementById('domLoadTime');
            const pageElement = document.getElementById('pageLoadTime');
            const jsHeapElement = document.getElementById('jsHeap');
            const networkCountElement = document.getElementById('networkCount');
            const totalSizeElement = document.getElementById('totalSize');
            const fpsElement = document.getElementById('fpsValue');
            
            if (metrics.domLoadTime !== undefined) {
                domElement.textContent = metrics.domLoadTime;
                const percent = Math.min(100, (metrics.domLoadTime / 2000) * 100);
                document.getElementById('domProgress').style.width = `${percent}%`;
                
                const card = domElement.closest('.metric-card');
                if (metrics.domLoadTime > 2000) {
                    card.classList.add('critical');
                    card.classList.remove('warning', 'success');
                } else if (metrics.domLoadTime > 1000) {
                    card.classList.add('warning');
                    card.classList.remove('critical', 'success');
                } else {
                    card.classList.add('success');
                    card.classList.remove('critical', 'warning');
                }
            }
            
            if (metrics.pageLoadTime !== undefined) {
                pageElement.textContent = metrics.pageLoadTime;
                const percent = Math.min(100, (metrics.pageLoadTime / 3000) * 100);
                document.getElementById('pageProgress').style.width = `${percent}%`;
                
                const card = pageElement.closest('.metric-card');
                if (metrics.pageLoadTime > 3000) {
                    card.classList.add('critical');
                    card.classList.remove('warning', 'success');
                } else if (metrics.pageLoadTime > 1500) {
                    card.classList.add('warning');
                    card.classList.remove('critical', 'success');
                } else {
                    card.classList.add('success');
                    card.classList.remove('critical', 'warning');
                }
            }
            
            if (metrics.jsHeap !== undefined) {
                jsHeapElement.textContent = metrics.jsHeap.toFixed(2);
                const card = jsHeapElement.closest('.metric-card');
                if (metrics.jsHeap > 100) {
                    card.classList.add('critical');
                } else if (metrics.jsHeap > 50) {
                    card.classList.add('warning');
                } else {
                    card.classList.add('success');
                }
            }
            
            if (metrics.networkCount !== undefined) {
                networkCountElement.textContent = metrics.networkCount;
            }
            
            if (metrics.totalSize !== undefined) {
                totalSizeElement.textContent = metrics.totalSize.toFixed(2);
            }
            
            if (metrics.fps !== undefined) {
                currentFps = metrics.fps;
                fpsElement.textContent = metrics.fps.toFixed(1);
                const card = fpsElement.closest('.metric-card');
                if (metrics.fps < 30) {
                    card.classList.add('critical');
                    card.classList.remove('warning', 'success');
                } else if (metrics.fps < 50) {
                    card.classList.add('warning');
                    card.classList.remove('critical', 'success');
                } else {
                    card.classList.add('success');
                    card.classList.remove('critical', 'warning');
                }
            }
        }

        function measurePerformance() {
            const perfData = performance.timing;
            const navigationStart = perfData.navigationStart;
            const domLoadTime = perfData.domContentLoadedEventEnd - navigationStart;
            const pageLoadTime = perfData.loadEventEnd - navigationStart;
            return { domLoadTime, pageLoadTime };
        }

        function measureMemory() {
            if (performance.memory) {
                return performance.memory.usedJSHeapSize / 1024 / 1024;
            }
            return null;
        }

        function measureNetwork() {
            const resources = performance.getEntriesByType('resource');
            const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
            return { count: resources.length, totalSize: totalSize / 1024 };
        }

        function startFPSMonitoring() {
            if (fpsInterval) clearInterval(fpsInterval);
            frameCount = 0;
            lastFpsTime = performance.now();
            
            function countFrame() {
                frameCount++;
                requestAnimationFrame(countFrame);
            }
            requestAnimationFrame(countFrame);
            
            fpsInterval = setInterval(() => {
                const now = performance.now();
                const fps = (frameCount * 1000) / (now - lastFpsTime);
                frameCount = 0;
                lastFpsTime = now;
                updateMetrics({ fps });
            }, 1000);
        }

        function measureAll() {
            const perf = measurePerformance();
            const memory = measureMemory();
            const network = measureNetwork();
            
            const metrics = {
                domLoadTime: perf.domLoadTime,
                pageLoadTime: perf.pageLoadTime,
                networkCount: network.count,
                totalSize: network.totalSize
            };
            
            if (memory !== null) {
                metrics.jsHeap = memory;
            }
            
            updateMetrics(metrics);
            return metrics;
        }

        function startMonitoring(duration = 10000) {
            if (monitoringInterval) clearInterval(monitoringInterval);
            addLog('🚀 เริ่มการตรวจสอบประสิทธิภาพระบบ...', 'info');
            addLog(`📊 ระยะเวลาตรวจสอบ: ${duration / 1000} วินาที`, 'info');
            measureAll();
            
            let elapsed = 0;
            monitoringInterval = setInterval(() => {
                elapsed += 1000;
                const metrics = measureAll();
                addLog(`📈 CPU Load Simulation: ${Math.floor(Math.random() * 40 + 20)}% (จำลอง)`, 'info');
                addLog(`📊 DOM Load: ${metrics.domLoadTime}ms, Page Load: ${metrics.pageLoadTime}ms`, 'info');
                
                if (elapsed >= duration) {
                    clearInterval(monitoringInterval);
                    monitoringInterval = null;
                    addLog('📋 === สรุปรายงานประสิทธิภาพ ===', 'success');
                    const finalMetrics = measureAll();
                    if (finalMetrics.pageLoadTime > 3000) {
                        addLog('⚠️ คำเตือน: Page Load Time สูงเกิน 3000ms ควรปรับปรุงประสิทธิภาพ', 'warning');
                    } else if (finalMetrics.pageLoadTime > 1500) {
                        addLog('⚡ Page Load Time อยู่ในเกณฑ์ปานกลาง ยังสามารถปรับปรุงได้', 'warning');
                    } else {
                        addLog('✅ Page Load Time อยู่ในเกณฑ์ดี', 'success');
                    }
                    addLog('✅ การตรวจสอบเสร็จสิ้น', 'success');
                }
            }, 1000);
        }

        function simulateHeavyLoad() {
            addLog('⚠️ กำลังจำลองโหลดหนัก...', 'warning');
            const startTime = performance.now();
            let result = 0;
            for (let i = 0; i < 100000000; i++) {
                result += Math.sqrt(i);
            }
            const duration = performance.now() - startTime;
            addLog(`📊 การจำลองโหลดหนักเสร็จสิ้น ใช้เวลา ${duration.toFixed(2)}ms`, 'info');
            if (duration > 1000) {
                addLog('⚠️ พบว่าโหลดหนักทำให้ระบบทำงานช้า ควรพิจารณาใช้ Web Worker สำหรับงานหนัก', 'warning');
            }
            measureAll();
        }

        function clearLogs() {
            const logContainer = document.getElementById('logContainer');
            logContainer.innerHTML = '';
            logs = [];
            addLog('🗑️ ล้างข้อมูลเรียบร้อย', 'info');
            addLog('💡 คำแนะนำ: เปิด Developer Tools (F12) → Performance Tab เพื่อดูรายละเอียดเพิ่มเติม', 'info');
        }

        document.getElementById('startMonitor').addEventListener('click', () => startMonitoring(10000));
        document.getElementById('measureNow').addEventListener('click', () => {
            const metrics = measureAll();
            addLog(`📊 วัดค่าปัจจุบัน: DOM Load = ${metrics.domLoadTime}ms, Page Load = ${metrics.pageLoadTime}ms`, 'success');
            if (metrics.jsHeap) addLog(`💾 JS Heap Usage: ${metrics.jsHeap.toFixed(2)} MB`, 'info');
            addLog(`🌐 Network: ${metrics.networkCount} requests, ${metrics.totalSize.toFixed(2)} KB`, 'info');
        });
        document.getElementById('clearLogs').addEventListener('click', clearLogs);
        document.getElementById('simulateLoad').addEventListener('click', simulateHeavyLoad);
        
        startFPSMonitoring();
        window.addEventListener('load', () => {
            setTimeout(() => {
                const metrics = measureAll();
                addLog(`📊 หน้าเว็บโหลดเสร็จ: DOM Load = ${metrics.domLoadTime}ms, Page Load = ${metrics.pageLoadTime}ms`, 'success');
            }, 100);
        });
