document.addEventListener('DOMContentLoaded', function () {
    const gradeFilter = document.getElementById('grade-filter');
    const subjectFilter = document.getElementById('subject-filter');
    const placeFilter = document.getElementById('place-filter');
    const yearFilter = document.getElementById('year-filter');
    const examPapers = document.getElementById('exam-papers');

    // Function to fetch exam data from JSON file
    async function fetchExamData() {
        try {
            const response = await fetch('assets/examData.json');
            if (!response.ok) {
                throw new Error('Failed to fetch exam data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exam data:', error);
            return []; // Return an empty array if fetching fails
        }
    }

    // Function to render exam papers based on selected filters
    async function renderExamPapers() {
        try {
            const examData = await fetchExamData();

            const selectedGrade = gradeFilter.value;
            const selectedSubject = subjectFilter.value;
            const selectedPlace = placeFilter.value;
            const selectedYear = yearFilter.value;

            const filteredPapers = examData.filter(paper => {
                return (selectedYear === 'all' || paper.year === selectedYear) &&
                    (selectedGrade === 'all' || paper.grade === selectedGrade) &&
                    (selectedSubject === 'all' || paper.subject === selectedSubject) &&
                    (selectedPlace === 'all' || paper.place === selectedPlace);
            });

            examPapers.innerHTML = '';

            if (filteredPapers.length === 0) {
                const noPapersMessage = document.createElement('p');
                noPapersMessage.innerHTML = `<p class="text-body-secondary">မေးခွန်းစာရွက်များမရှိသေးပါ။ No exam papers found. Some papers aren't here yet!</p>
                <a href="mailto:paperpocket0@gmail.com" class="d-block btn btn-outline-primary">Contribute to make this more accessible!</a>`;
                noPapersMessage.style.opacity = '0'; // Start hidden
                noPapersMessage.style.transition = 'opacity 0.8s ease-in-out'; // Smooth fade-in
                examPapers.appendChild(noPapersMessage);

                // Apply fade-in effect after a short delay
                setTimeout(() => {
                    noPapersMessage.style.opacity = '1';
                }, 50);
            } else {
                filteredPapers.forEach(paper => {
                    const paperLink = document.createElement('a');
                    paperLink.textContent = paper.name;
                    paperLink.href = paper.url;
                    paperLink.classList.add('d-inline-flex', 'focus-ring', 'focus-ring-dark', 'py-1', 'px-2', 'my-1', 'link-primary', 'link-offset-2', 'link-underline-opacity-25', 'link-underline-opacity-100-hover');
                    paperLink.download = ''; // Enable download on PC
                    examPapers.appendChild(paperLink);
                    examPapers.appendChild(document.createElement('br')); // Add line break
                });
            }
        } catch (error) {
            console.error('Error rendering exam papers:', error);
        }
    }


    // Event listeners for filter changes
    gradeFilter.addEventListener('change', renderExamPapers);
    subjectFilter.addEventListener('change', renderExamPapers);
    placeFilter.addEventListener('change', renderExamPapers);
    yearFilter.addEventListener('change', renderExamPapers);

    // Initial render
    renderExamPapers();
});


// =========== URL COPY FUNCTION (from DeepSeek) =========== //

// IIFE to avoid global pollution
(function() {
    'use strict';
    
    // Configuration - Adjust these as needed
    const CONFIG = {
        FEEDBACK_DURATION: 3000,
        MAX_Z_INDEX: 2147483647,
        DEBOUNCE_DELAY: 300,
        AUTO_CLEANUP_DELAY: 1000,
        MODAL_TIMEOUT: 30000,
        RETRY_ATTEMPTS: 2
    };
    
    // State management
    const state = {
        isCopying: false,
        retryCount: 0,
        lastCopyTime: 0,
        currentModal: null,
        listeners: []
    };
    
    // Mobile-specific detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Clipboard capability detection - MOBILE FIXED
    const capabilities = {
        // Modern Clipboard API (async) - MOBILE FIX: Check async properly
        hasClipboardAPI: !!(navigator.clipboard && 
                           typeof navigator.clipboard.writeText === 'function' &&
                           navigator.clipboard.writeText instanceof Function),
        
        // Legacy execCommand - MOBILE FIX: iOS Safari still supports this
        hasExecCommand: !!(document.queryCommandSupported && 
                          document.queryCommandSupported('copy')),
        
        // IE specific (not on mobile)
        hasClipboardData: !!(window.clipboardData && 
                            typeof window.clipboardData.setData === 'function'),
        
        // Secure context check - MOBILE FIX: HTTPS required on iOS
        isSecureContext: window.isSecureContext || 
                        window.location.protocol === 'https:' ||
                        window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1',
        
        // Mobile detection
        isIOS: isIOS,
        isAndroid: isAndroid,
        isMobile: isMobile,
        isSafari: isSafari,
        
        // MOBILE FIX: Touch device with better detection
        isTouchDevice: 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
    };
    
    /**
     * MAIN ENTRY POINT - MOBILE FIXED
     */
    function initCopyUrlButton(button) {
        const btn = typeof button === 'string' ? document.getElementById(button) : button;
        
        if (!btn) {
            console.warn('Copy button not found:', button);
            return;
        }
        
        // MOBILE FIX: Remove touch-action conflicts
        btn.style.touchAction = 'manipulation';
        btn.style.webkitTapHighlightColor = 'transparent';
        
        // Add click handler with debouncing
        const clickHandler = createDebouncedHandler(async (event) => {
            // MOBILE FIX: Prevent default only for touch events
            if (capabilities.isTouchDevice) {
                event.preventDefault();
            }
            event.stopPropagation();
            
            if (state.isCopying) {
                showFeedback('Please wait...', 'info');
                return;
            }
            
            state.isCopying = true;
            state.lastCopyTime = Date.now();
            
            try {
                await copyCurrentUrl();
            } catch (error) {
                console.error('URL copy failed:', error);
                handleCopyFailure(error);
            } finally {
                state.isCopying = false;
                state.retryCount = 0;
            }
        }, CONFIG.DEBOUNCE_DELAY);
        
        // MOBILE FIX: Simplified event listeners for mobile
        if (capabilities.isTouchDevice) {
            // Use pointer events for better mobile support
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                btn.style.transform = 'scale(0.98)';
            });
            
            btn.addEventListener('pointerup', (e) => {
                e.preventDefault();
                btn.style.transform = '';
                clickHandler(e);
            });
            
            btn.addEventListener('pointercancel', () => {
                btn.style.transform = '';
            });
        } else {
            btn.addEventListener('click', clickHandler);
        }
        
        // Accessibility
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Copy page URL to clipboard');
        btn.setAttribute('tabindex', '0');
        
        state.listeners.push({ element: btn, type: 'click', handler: clickHandler });
    }
    
    /**
     * CORE COPY FUNCTIONALITY - MOBILE FIXED
     */
    async function copyCurrentUrl() {
        const url = getCurrentUrl();
        
        // MOBILE FIX: Try Clipboard API with better error handling
        if (capabilities.hasClipboardAPI && capabilities.isSecureContext) {
            try {
                await copyWithClipboardAPI(url);
                return;
            } catch (error) {
                console.warn('Clipboard API failed:', error);
            }
        }
        
        // MOBILE FIX: execCommand works better on mobile, especially iOS
        if (capabilities.hasExecCommand) {
            try {
                await copyWithExecCommandMobile(url);
                return;
            } catch (error) {
                console.warn('execCommand failed:', error);
            }
        }
        
        // IE clipboardData (not on mobile, but keep for completeness)
        if (capabilities.hasClipboardData) {
            try {
                copyWithClipboardData(url);
                return;
            } catch (error) {
                console.warn('clipboardData failed:', error);
            }
        }
        
        // MOBILE FIX: Manual copy with mobile-friendly interface
        await showManualCopyInterface(url);
    }
    
    /**
     * STRATEGY 1: Modern Clipboard API - MOBILE FIXED
     */
    async function copyWithClipboardAPI(url) {
        // MOBILE FIX: No permission query on mobile, just try
        try {
            await navigator.clipboard.writeText(url);
            showFeedback('URL copied to clipboard!', 'success');
            return;
        } catch (error) {
            // MOBILE FIX: Safari throws if not in secure context
            if (capabilities.isIOS && !capabilities.isSecureContext) {
                throw new Error('iOS requires HTTPS for clipboard');
            }
            throw error;
        }
    }
    
    /**
     * STRATEGY 2: Legacy execCommand - MOBILE FIXED VERSION
     */
    function copyWithExecCommandMobile(url) {
        return new Promise((resolve, reject) => {
            // MOBILE FIX: Create temporary input instead of textarea for better mobile support
            const input = document.createElement('input');
            input.value = url;
            input.setAttribute('readonly', '');
            input.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                opacity: 0;
                pointer-events: none;
            `;
            
            document.body.appendChild(input);
            
            // MOBILE FIX: Different focus/select strategy for mobile
            if (capabilities.isMobile) {
                // For mobile, we need to temporarily make it visible
                input.style.position = 'absolute';
                input.style.left = '0';
                input.style.top = '0';
                input.style.width = '100%';
                input.style.height = '100%';
                input.style.opacity = '0.01';
                input.style.zIndex = '10000';
            }
            
            // Select the text
            input.select();
            input.setSelectionRange(0, 99999);
            
            // MOBILE FIX: Force focus for iOS
            if (capabilities.isIOS) {
                input.focus();
                // iOS needs contenteditable for some versions
                input.contentEditable = true;
                input.readOnly = false;
                
                const range = document.createRange();
                range.selectNodeContents(input);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            // Execute copy
            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (e) {
                console.error('execCommand error:', e);
            }
            
            // Cleanup
            setTimeout(() => {
                if (input.parentNode) {
                    document.body.removeChild(input);
                }
                
                if (success) {
                    showFeedback('URL copied to clipboard!', 'success');
                    resolve();
                } else {
                    reject(new Error('Copy command failed on mobile'));
                }
            }, 100);
        });
    }
    
    /**
     * STRATEGY 3: IE clipboardData
     */
    function copyWithClipboardData(url) {
        const success = window.clipboardData.setData('Text', url);
        if (success) {
            showFeedback('URL copied to clipboard!', 'success');
        } else {
            throw new Error('clipboardData.setData failed');
        }
    }
    
    /**
     * STRATEGY 5: Manual Copy Interface - MOBILE FIXED
     */
    async function showManualCopyInterface(url) {
        return new Promise((resolve) => {
            cleanupExistingModal();
            
            // MOBILE FIX: Create mobile-friendly modal
            const modal = createMobileFriendlyModal(url);
            document.body.appendChild(modal);
            state.currentModal = modal;
            
            // MOBILE FIX: Auto-close timeout
            const timeoutId = setTimeout(() => {
                if (modal.parentNode) {
                    closeManualCopyModal();
                }
            }, CONFIG.MODAL_TIMEOUT);
            
            modal.dataset.timeoutId = timeoutId;
            
            // MOBILE FIX: Focus for mobile
            setTimeout(() => {
                const textarea = modal.querySelector('#manual-copy-textarea');
                if (textarea) {
                    textarea.focus();
                    textarea.select();
                    
                    // MOBILE FIX: Show keyboard on mobile
                    if (capabilities.isMobile) {
                        textarea.setAttribute('readonly', 'false');
                        setTimeout(() => {
                            textarea.setAttribute('readonly', 'true');
                        }, 100);
                    }
                }
            }, 100);
            
            resolve();
        });
    }
    
    /**
     * MOBILE-FRIENDLY MODAL
     */
    function createMobileFriendlyModal(url) {
        const modal = document.createElement('div');
        modal.className = 'url-copy-mobile-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: ${CONFIG.MAX_Z_INDEX - 1};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            -webkit-overflow-scrolling: touch;
        `;
        
        // MOBILE FIX: Use input instead of textarea for better mobile UX
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 25px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
            ">
                <h2 style="
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: #333;
                    font-size: ${capabilities.isMobile ? '20px' : '24px'};
                ">
                    📋 Copy URL
                </h2>
                
                <p style="
                    color: #666;
                    margin-bottom: 25px;
                    line-height: 1.5;
                    font-size: ${capabilities.isMobile ? '16px' : '18px'};
                ">
                    ${capabilities.isMobile ? 'Tap to select, then copy' : 'Select and copy the URL below:'}
                </p>
                
                <div style="
                    background: #f8f9fa;
                    border: 2px solid #007bff;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 25px;
                    position: relative;
                ">
                    <input 
                        type="text" 
                        id="manual-copy-textarea"
                        value="${escapeHtml(url)}"
                        readonly
                        style="
                            width: 100%;
                            border: none;
                            background: transparent;
                            font-family: monospace;
                            font-size: ${capabilities.isMobile ? '14px' : '16px'};
                            color: #333;
                            outline: none;
                            padding: 0;
                            margin: 0;
                            text-align: center;
                            word-break: break-all;
                        "
                    />
                </div>
                
                <div style="
                    display: flex;
                    flex-direction: ${capabilities.isMobile ? 'column' : 'row'};
                    gap: 15px;
                    margin-top: 20px;
                ">
                    <button 
                        id="modal-copy-btn"
                        style="
                            flex: 1;
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: ${capabilities.isMobile ? '18px' : '15px 30px'};
                            border-radius: ${capabilities.isMobile ? '12px' : '8px'};
                            font-size: ${capabilities.isMobile ? '18px' : '16px'};
                            font-weight: 600;
                            cursor: pointer;
                            touch-action: manipulation;
                        "
                    >
                        ${capabilities.isMobile ? '📋 Try Auto-Copy' : 'Copy Selected'}
                    </button>
                    
                    <button 
                        id="modal-close-btn"
                        style="
                            flex: 1;
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: ${capabilities.isMobile ? '18px' : '15px 30px'};
                            border-radius: ${capabilities.isMobile ? '12px' : '8px'};
                            font-size: ${capabilities.isMobile ? '18px' : '16px'};
                            cursor: pointer;
                            touch-action: manipulation;
                        "
                    >
                        Close
                    </button>
                </div>
                
                ${capabilities.isMobile ? `
                <div style="
                    margin-top: 25px;
                    padding: 15px;
                    background: #e9ecef;
                    border-radius: 10px;
                    font-size: 14px;
                    color: #495057;
                ">
                    <strong>💡 Tip:</strong> Long press to select, then tap "Copy"
                </div>
                ` : ''}
            </div>
        `;
        
        // Event listeners
        setTimeout(() => {
            const textarea = modal.querySelector('#manual-copy-textarea');
            const copyBtn = modal.querySelector('#modal-copy-btn');
            const closeBtn = modal.querySelector('#modal-close-btn');
            
            // MOBILE FIX: Better text selection for mobile
            textarea.addEventListener('click', function() {
                this.select();
                this.setSelectionRange(0, 99999);
                
                if (capabilities.isMobile) {
                    // Try to show copy menu on mobile
                    this.focus();
                    document.execCommand('selectAll', false, null);
                }
            });
            
            textarea.addEventListener('focus', function() {
                this.select();
            });
            
            // Try copy from modal
            copyBtn.addEventListener('click', async function() {
                textarea.select();
                textarea.setSelectionRange(0, 99999);
                
                // MOBILE FIX: Try multiple methods
                let copied = false;
                
                // Try modern API
                if (capabilities.hasClipboardAPI) {
                    try {
                        await navigator.clipboard.writeText(textarea.value);
                        copied = true;
                    } catch (e) {
                        console.log('Modal copy failed with Clipboard API:', e);
                    }
                }
                
                // Try execCommand
                if (!copied && capabilities.hasExecCommand) {
                    try {
                        copied = document.execCommand('copy');
                    } catch (e) {
                        console.log('Modal copy failed with execCommand:', e);
                    }
                }
                
                if (copied) {
                    showFeedback('Copied successfully!', 'success');
                    setTimeout(closeManualCopyModal, 1000);
                } else {
                    showFeedback('Please select and copy manually', 'info');
                }
            });
            
            // Close button
            closeBtn.addEventListener('click', closeManualCopyModal);
            
            // Close on overlay click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeManualCopyModal();
                }
            });
            
            // Escape key (desktop only)
            if (!capabilities.isMobile) {
                const escapeHandler = (e) => {
                    if (e.key === 'Escape') {
                        closeManualCopyModal();
                    }
                };
                document.addEventListener('keydown', escapeHandler);
                modal.dataset.escapeHandler = escapeHandler;
            }
        }, 0);
        
        return modal;
    }
    
    /**
     * UTILITY FUNCTIONS
     */
    
    function getCurrentUrl() {
        return window.location.href;
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function closeManualCopyModal() {
        if (state.currentModal) {
            // Clear timeout
            if (state.currentModal.dataset.timeoutId) {
                clearTimeout(parseInt(state.currentModal.dataset.timeoutId));
            }
            
            // Remove escape handler
            if (state.currentModal.dataset.escapeHandler) {
                document.removeEventListener('keydown', state.currentModal.dataset.escapeHandler);
            }
            
            // Remove modal
            if (state.currentModal.parentNode) {
                state.currentModal.parentNode.removeChild(state.currentModal);
            }
            
            state.currentModal = null;
        }
    }
    
    function cleanupExistingModal() {
        const existing = document.querySelector('.url-copy-mobile-modal');
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }
        state.currentModal = null;
    }
    
    function showFeedback(message, type = 'info', duration = CONFIG.FEEDBACK_DURATION) {
        // Remove existing feedback
        const existing = document.querySelector('.url-copy-feedback');
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }
        
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `url-copy-feedback feedback-${type}`;
        
        // MOBILE FIX: Position for mobile (bottom is better)
        const topPosition = capabilities.isMobile ? 'auto' : '20px';
        const bottomPosition = capabilities.isMobile ? '20px' : 'auto';
        
        Object.assign(feedback.style, {
            position: 'fixed',
            top: topPosition,
            bottom: bottomPosition,
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#4CAF50' : 
                       type === 'error' ? '#f44336' : 
                       type === 'warning' ? '#ff9800' : '#2196F3',
            color: 'white',
            padding: capabilities.isMobile ? '18px 25px' : '15px 25px',
            borderRadius: capabilities.isMobile ? '12px' : '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: CONFIG.MAX_Z_INDEX - 2,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: capabilities.isMobile ? '16px' : '14px',
            fontWeight: '500',
            textAlign: 'center',
            maxWidth: '90%',
            minWidth: capabilities.isMobile ? '300px' : '200px',
            wordBreak: 'break-word',
            opacity: '0',
            transition: 'opacity 0.3s, transform 0.3s',
            pointerEvents: 'none'
        });
        
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, duration);
    }
    
    function handleCopyFailure(error) {
        console.error('Copy failed:', error);
        
        const url = getCurrentUrl();
        
        // MOBILE FIX: Immediate manual fallback on mobile
        if (capabilities.isMobile || state.retryCount >= CONFIG.RETRY_ATTEMPTS) {
            showFeedback('Opening manual copy...', 'info');
            showManualCopyInterface(url);
        } else if (state.retryCount < CONFIG.RETRY_ATTEMPTS) {
            state.retryCount++;
            setTimeout(() => {
                copyCurrentUrl().catch(() => {
                    showFeedback('Opening manual copy...', 'warning');
                    showManualCopyInterface(url);
                });
            }, 500);
        }
    }
    
    function createDebouncedHandler(fn, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }
    
    /**
     * PUBLIC API
     */
    window.URLCopy = {
        init: initCopyUrlButton,
        
        copy: async function() {
            try {
                await copyCurrentUrl();
                return true;
            } catch (error) {
                console.error('URLCopy.copy failed:', error);
                return false;
            }
        },
        
        canCopy: function() {
            return capabilities.hasClipboardAPI || 
                   capabilities.hasExecCommand || 
                   capabilities.hasClipboardData;
        },
        
        getUrl: getCurrentUrl,
        
        destroy: function() {
            // Remove event listeners
            state.listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
            state.listeners = [];
            
            // Cleanup modal
            cleanupExistingModal();
            
            // Reset state
            state.isCopying = false;
            state.retryCount = 0;
            state.currentModal = null;
        },
        
        version: '2.0.1-mobile-fixed',
        
        getCapabilities: function() {
            return { ...capabilities };
        }
    };
    
    /**
     * AUTO-INITIALIZATION
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllButtons);
    } else {
        initAllButtons();
    }
    
    function initAllButtons() {
        const buttons = document.querySelectorAll('[data-url-copy]');
        buttons.forEach(button => {
            initCopyUrlButton(button);
        });
    }
    
})();