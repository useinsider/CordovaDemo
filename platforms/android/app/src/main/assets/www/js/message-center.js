let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        document.getElementById('backButton').addEventListener('click', this.goBack);
        document.getElementById('deleteAllButton').addEventListener('click', this.deleteAllMessages.bind(this));
        this.loadMessages();
    },
    goBack: function() {
        window.location.href = 'index.html';
    },
    handleAppCardsError: function(operation, error) {
        var ErrorCode = window.Insider.AppCardsErrorCode;
        if (error && error.code) {
            switch (error.code) {
                case ErrorCode.SDK_NOT_INITIALIZED:
                    console.error('[INSIDER][APP_CARDS][' + operation + ']: SDK not initialized -', error.message);
                    break;
                case ErrorCode.INVALID_PARAMETER:
                    console.error('[INSIDER][APP_CARDS][' + operation + ']: Invalid parameter -', error.message);
                    break;
                case ErrorCode.NETWORK_ERROR:
                    console.error('[INSIDER][APP_CARDS][' + operation + ']: Network error -', error.message);
                    break;
                case ErrorCode.SERVER_ERROR:
                    console.error('[INSIDER][APP_CARDS][' + operation + ']: Server error -', error.message);
                    break;
                case ErrorCode.PARSE_ERROR:
                    console.error('[INSIDER][APP_CARDS][' + operation + ']: Parse error -', error.message);
                    break;
                default:
                    console.error('[INSIDER][APP_CARDS][' + operation + ']: Unknown error -', error.message);
                    break;
            }
        } else {
            console.error('[INSIDER][APP_CARDS][' + operation + ']:', error);
        }
    },
    currentCampaignResponse: null,
    deleteAllMessages: async function() {
        if (!this.currentCampaignResponse || !this.currentCampaignResponse.appCards || this.currentCampaignResponse.appCards.length === 0) {
            return;
        }
        try {
            const appCardIds = this.currentCampaignResponse.appCards.map(function(c) { return c.id; });
            await window.Insider.appCards.delete(appCardIds);
            console.log('[INSIDER][APP_CARDS][DELETE_ALL]: Deleted all app cards');
            document.getElementById('messagesContainer').innerHTML = '';
            document.getElementById('deleteAllButton').style.display = 'none';
            document.getElementById('emptyState').style.display = 'block';
            this.currentCampaignResponse = null;
        } catch (error) {
            this.handleAppCardsError('DELETE_ALL', error);
        }
    },
    deleteAppCard: function(appCard) {
        appCard.delete(function(error) {
            if (error) {
                app.handleAppCardsError('DELETE', error);
                return;
            }
            console.log('[INSIDER][APP_CARDS][DELETE]:', appCard.id);
            var cardEl = document.querySelector('[data-message-id="' + appCard.id + '"]');
            if (cardEl) {
                cardEl.remove();
            }
            // Remove from currentCampaignResponse
            if (app.currentCampaignResponse && app.currentCampaignResponse.appCards) {
                app.currentCampaignResponse.appCards = app.currentCampaignResponse.appCards.filter(function(c) { return c.id !== appCard.id; });
                if (app.currentCampaignResponse.appCards.length === 0) {
                    document.getElementById('deleteAllButton').style.display = 'none';
                    document.getElementById('emptyState').style.display = 'block';
                }
            }
        });
    },
    loadMessages: async function() {
        const loadingEl = document.getElementById('loading');
        const errorEl = document.getElementById('error');
        const messagesContainer = document.getElementById('messagesContainer');
        const emptyState = document.getElementById('emptyState');

        try {
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            messagesContainer.innerHTML = '';
            emptyState.style.display = 'none';

            // Get app cards campaigns using the appCards API
            const campaignResponse = await window.Insider.appCards.getCampaigns();

            console.log('[INSIDER][APP_CARDS][CAMPAIGNS]:', campaignResponse);

            loadingEl.style.display = 'none';

            if (!campaignResponse || !campaignResponse.appCards || campaignResponse.appCards.length === 0) {
                emptyState.style.display = 'block';
                return;
            }

            this.currentCampaignResponse = campaignResponse;
            document.getElementById('deleteAllButton').style.display = 'block';

            // Render app cards
            campaignResponse.appCards.forEach((appCard, index) => {
                const cardEl = this.createMessageElement(appCard);
                appCard.view();
                messagesContainer.appendChild(cardEl);
            });

        } catch (error) {
            loadingEl.style.display = 'none';
            this.handleAppCardsError('GET_CAMPAIGNS', error);
            errorEl.textContent = 'Error loading app cards: ' + (error.message || error);
            errorEl.style.display = 'block';
        }
    },
    updateMessageReadStatus: function(messageId, isRead) {
        const messageDiv = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageDiv) return;

        // Update message item class
        messageDiv.className = `message-item ${isRead ? 'read' : 'unread'}`;

        // Update status div
        const statusDiv = messageDiv.querySelector('.message-status');
        if (statusDiv) {
            statusDiv.className = `message-status ${isRead ? 'read' : 'unread'}`;
            statusDiv.textContent = isRead ? 'READ' : 'UNREAD';
        }
    },
    createMessageElement: function(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${message.isRead ? 'read' : 'unread'}`;
        messageDiv.setAttribute('data-message-id', message.id);

        // Message header with status
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';

        const statusDiv = document.createElement('div');
        statusDiv.className = `message-status ${message.isRead ? 'read' : 'unread'}`;
        statusDiv.textContent = message.isRead ? 'READ' : 'UNREAD';
        headerDiv.appendChild(statusDiv);

        messageDiv.appendChild(headerDiv);

        // Message content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (message.content) {
            if (message.content.title) {
                const titleDiv = document.createElement('div');
                titleDiv.className = 'message-title';
                titleDiv.textContent = message.content.title;
                contentDiv.appendChild(titleDiv);
            }

            if (message.content.description) {
                const descDiv = document.createElement('div');
                descDiv.className = 'message-description';
                descDiv.textContent = message.content.description;
                contentDiv.appendChild(descDiv);
            }
        }

        // Message images - horizontal scrollable
        if (message.images && message.images.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'message-images-container';
            
            message.images.forEach(image => {
                if (image.url) {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'message-image-wrapper';
                    
                    const img = document.createElement('img');
                    img.className = 'message-image';
                    img.src = image.url;
                    img.alt = 'Message image';
                    img.onerror = function() {
                        this.style.display = 'none';
                    };
                    
                    imgWrapper.appendChild(img);
                    imagesContainer.appendChild(imgWrapper);
                }
            });
            
            contentDiv.appendChild(imagesContainer);
        }

        // Message type
        if (message.type) {
            const typeDiv = document.createElement('div');
            typeDiv.className = 'message-type';
            typeDiv.textContent = `Type: ${message.type}`;
            contentDiv.appendChild(typeDiv);
        }

        messageDiv.appendChild(contentDiv);

        // Message buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'message-buttons-container';

        // Dynamic buttons from message
        if (message.buttons && message.buttons.length > 0) {
            const dynamicButtonsDiv = document.createElement('div');
            dynamicButtonsDiv.className = 'message-buttons message-buttons-dynamic';

            message.buttons.forEach(button => {
                const buttonEl = document.createElement('button');
                buttonEl.className = 'message-button';
                buttonEl.textContent = button.text || 'Button';
                buttonEl.onclick = (e) => {
                    e.stopPropagation(); // Prevent message click
                    try {
                        if (button.action) {
                            try {
                                console.log(`[INSIDER][APP_CARDS][BUTTON_ACTION_TYPE][${button.id}]:`, button.action.type);
                                if (button.action.type === 'deep_link') {
                                    if (button.action.url) {
                                        console.log(`[INSIDER][APP_CARDS][BUTTON_URL][${button.id}]:`, button.action.url);
                                    }
                                    if (button.action.deeplinkType) {
                                        console.log(`[INSIDER][APP_CARDS][BUTTON_DEEPLINK_TYPE][${button.id}]:`, button.action.deeplinkType);
                                    }
                                    if (button.action.keysAndValues) {
                                        console.log(`[INSIDER][APP_CARDS][BUTTON_KEYS_AND_VALUES][${button.id}]:`, JSON.stringify(button.action.keysAndValues));
                                    }
                                    if (button.action.json) {
                                        console.log(`[INSIDER][APP_CARDS][BUTTON_JSON][${button.id}]:`, JSON.stringify(button.action.json));
                                    }
                                }
                            } catch (error) {
                                console.error('[INSIDER][APP_CARDS][BUTTON_ACTION_LOG_ERROR]:', error);
                            }
                        }

                        button.click();
                        console.log('[INSIDER][APP_CARDS][BUTTON_CLICK]:', button.id);
                    } catch (error) {
                        app.handleAppCardsError('BUTTON_CLICK', error);
                    }
                };
                dynamicButtonsDiv.appendChild(buttonEl);
            });

            buttonsContainer.appendChild(dynamicButtonsDiv);
        }

        // Read and Unread buttons - single row, side by side
        const readUnreadButtonsDiv = document.createElement('div');
        readUnreadButtonsDiv.className = 'message-buttons message-buttons-read-unread';

        const readButton = document.createElement('button');
        readButton.className = 'message-button message-button-read';
        readButton.textContent = 'Read';
        readButton.onclick = (e) => {
            e.stopPropagation();
            message.markAsRead((error) => {
                if (error) {
                    app.handleAppCardsError('MARK_AS_READ', error);
                    return;
                }
                console.log('[INSIDER][APP_CARDS][MARK_AS_READ]:', message.id);
                app.updateMessageReadStatus(message.id, true);
            });
        };
        readUnreadButtonsDiv.appendChild(readButton);

        const unreadButton = document.createElement('button');
        unreadButton.className = 'message-button message-button-unread';
        unreadButton.textContent = 'Unread';
        unreadButton.onclick = (e) => {
            e.stopPropagation();
            message.markAsUnread((error) => {
                if (error) {
                    app.handleAppCardsError('MARK_AS_UNREAD', error);
                    return;
                }
                console.log('[INSIDER][APP_CARDS][MARK_AS_UNREAD]:', message.id);
                app.updateMessageReadStatus(message.id, false);
            });
        };
        readUnreadButtonsDiv.appendChild(unreadButton);

        buttonsContainer.appendChild(readUnreadButtonsDiv);

        // Delete button
        const deleteButtonDiv = document.createElement('div');
        deleteButtonDiv.className = 'message-buttons message-buttons-delete';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'message-button message-button-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            app.deleteAppCard(message);
        };
        deleteButtonDiv.appendChild(deleteButton);
        buttonsContainer.appendChild(deleteButtonDiv);

        messageDiv.appendChild(buttonsContainer);

        // Message click handler
        messageDiv.onclick = () => {
            try {
                if (message.action) {
                    try {
                        console.log(`[INSIDER][APP_CARDS][CARD_ACTION_TYPE][${message.id}]:`, message.action.type);
                        if (message.action.type === 'deep_link') {
                            if (message.action.url) {
                                console.log(`[INSIDER][APP_CARDS][CARD_URL][${message.id}]:`, message.action.url);
                            }
                            if (message.action.deeplinkType) {
                                console.log(`[INSIDER][APP_CARDS][CARD_DEEPLINK_TYPE][${message.id}]:`, message.action.deeplinkType);
                            }
                            if (message.action.keysAndValues) {
                                console.log(`[INSIDER][APP_CARDS][CARD_KEYS_AND_VALUES][${message.id}]:`, message.action.keysAndValues);
                            }
                            if (message.action.json) {
                                console.log(`[INSIDER][APP_CARDS][CARD_JSON][${message.id}]:`, message.action.json);
                            }
                        }
                    } catch (error) {
                        console.error('[INSIDER][APP_CARDS][CARD_ACTION_LOG_ERROR]:', error);
                    }
                }

                // Call click when message is clicked
                message.click();
                console.log('[INSIDER][APP_CARDS][CLICK]:', message.id);
            } catch (error) {
                app.handleAppCardsError('CLICK', error);
            }
        };

        return messageDiv;
    }
};

app.initialize();
