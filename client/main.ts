import { Limitr } from '@formata/limitr';
import { LitElement, html, css, CSSResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { initStof } from '@formata/stof';
import '@formata/limitr-ui';


// @ts-ignore
import stofWasm from '@formata/stof/wasm?url';
await initStof(stofWasm);


// Create a single Limitr policy instance we can use with our front-end app
// Can pass this policy into components as properties or use it outright
const limitrPolicy = await Limitr.cloud({ token: 'lmlive_W80FjPoWoiUWY3EGhojcJjAQQSaJ' });

// Add our starting user for the demo...
await limitrPolicy?.addCloudCustomer('demo_user');


@customElement('app-main')
/**
 * Main app component.
 */
export class AppMain extends LitElement {
    @state()
    private message: string = '';

    @property({ type: Object })
    private policy?: Limitr;

    @state()
    private customerName: string = 'Demo User';

    @state()
    private customerId: string = 'demo_user';

    @state()
    private customerEmail: string = 'demo@example.com';

    @state()
    private showEditDialog: boolean = false;

    @state()
    private editName: string = '';

    @state()
    private editId: string = '';

    @state()
    private editEmail: string = '';

    @state()
    private tokensInput: string = '1000';

    @state()
    private storageInput: string = '100MB';

    @state()
    private seatsInput: string = '1';


    static get styles(): CSSResult {
        return css`
        :host {
            display: block;
            min-height: 100vh;
            background: #ffffff;
            color: #000000;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        h1 {
            font-size: 2rem;
            font-weight: 600;
            margin: 0 0 2rem 0;
            color: #000000;
        }

        .customer-section {
            background: #000000;
            color: #ffffff;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }

        .customer-section h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 1rem 0;
        }

        .customer-fields {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .field-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .field-group label {
            font-size: 0.875rem;
            font-weight: 500;
            opacity: 0.8;
        }

        .field-group input[readonly] {
            background: #1a1a1a;
            color: #ffffff;
            border: 1px solid #333333;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 1rem;
        }

        .edit-button {
            padding: 0.5rem 1rem;
            background: #ffffff;
            color: #000000;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .edit-button:hover {
            opacity: 0.8;
        }

        .usage-section {
            margin-bottom: 2rem;
        }

        .usage-section h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 1rem 0;
        }

        .usage-controls {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .usage-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .usage-row input {
            flex: 0 0 150px;
            padding: 0.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 1rem;
        }

        .usage-row button {
            flex: 1;
            padding: 0.5rem 1rem;
            background: #272727;
            color: #ffffff;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .usage-row button:hover {
            opacity: 0.8;
        }

        .message {
            margin-top: 1rem;
            padding: 1rem;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 0.875rem;
            min-height: 40px;
        }

        .pricing-section {
            margin-top: 3rem;
        }

        .pricing-section h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 1rem 0;
        }

        .pricing-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Dialog styles */
        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .dialog {
            background: #ffffff;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
        }

        .dialog h3 {
            margin: 0 0 1.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .dialog .field-group {
            margin-bottom: 1rem;
        }

        .dialog .field-group input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
        }

        .dialog-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }

        .dialog-actions button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .cancel-button {
            background: #f5f5f5;
            color: #000000;
        }

        .save-button {
            background: #000000;
            color: #ffffff;
        }

        .dialog-actions button:hover {
            opacity: 0.8;
        }
        `;
    }


    connectedCallback(): void {
        super.connectedCallback();
        this.policy = limitrPolicy;
    }


    render() {
        return html`
            <div class="container">
                <h1>Limitr Demo</h1>
                
                <!-- Current Customer Section -->
                <div class="customer-section">
                    <h2>Current Customer</h2>
                    <div class="customer-fields">
                        <div class="field-group">
                            <label>Name</label>
                            <input type="text" readonly .value=${this.customerName} />
                        </div>
                        <div class="field-group">
                            <label>Customer ID</label>
                            <input type="text" readonly .value=${this.customerId} />
                        </div>
                        <div class="field-group">
                            <label>Email</label>
                            <input type="text" readonly .value=${this.customerEmail} />
                        </div>
                    </div>
                    <button class="edit-button" @click=${this.openEditDialog}>
                        Edit Customer
                    </button>
                </div>

                <!-- Usage Section -->
                <div class="usage-section">
                    <h2>Modify/Meter/Allow Usage (Limitr)</h2>
                    <div class="usage-controls">
                        <div class="usage-row">
                            <input 
                                type="number" 
                                .value=${this.tokensInput}
                                @input=${(e: Event) => this.tokensInput = (e.target as HTMLInputElement).value}
                                placeholder="Amount"
                            />
                            <button @click=${this.chatTokens}>Spend AI Chat Tokens</button>
                        </div>
                        <div class="usage-row">
                            <input 
                                type="text" 
                                .value=${this.storageInput}
                                @input=${(e: Event) => this.storageInput = (e.target as HTMLInputElement).value}
                                placeholder="Amount"
                            />
                            <button @click=${this.changeStorage}>Change Storage</button>
                        </div>
                        <div class="usage-row">
                            <input 
                                type="number" 
                                .value=${this.seatsInput}
                                @input=${(e: Event) => this.seatsInput = (e.target as HTMLInputElement).value}
                                placeholder="Amount"
                            />
                            <button @click=${this.changeSeats}>Change Seat Quantity</button>
                        </div>
                    </div>

                    ${this.message ? html`
                        <div class="message">${this.message}</div>
                    ` : ''}
                </div>

                <!-- Pricing Section -->
                <div class="pricing-section">
                    <h2>Plans & Usage</h2>
                    <div class="pricing-container">
                        <limitr-current-plan
                            .policy=${this.policy}
                            .customerId=${this.customerId}
                            ?showStripeInfo=${false}
                            ?cancelImmediately=${true}
                            ?requestStripeInvoices=${false}
                            ?requestStripePortalUrl=${false}
                        ></limitr-current-plan>
                    </div>
                </div>
            </div>

            <!-- Edit Customer Dialog -->
            ${this.showEditDialog ? html`
                <div class="dialog-overlay" @click=${this.closeEditDialog}>
                    <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
                        <h3>Edit Customer</h3>
                        <div class="field-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                .value=${this.editName}
                                @input=${(e: Event) => this.editName = (e.target as HTMLInputElement).value}
                                placeholder="Enter name"
                            />
                        </div>
                        <div class="field-group">
                            <label>Customer ID</label>
                            <input 
                                type="text" 
                                .value=${this.editId}
                                @input=${(e: Event) => this.editId = (e.target as HTMLInputElement).value}
                                placeholder="Enter customer ID"
                            />
                        </div>
                        <div class="field-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                .value=${this.editEmail}
                                @input=${(e: Event) => this.editEmail = (e.target as HTMLInputElement).value}
                                placeholder="Enter email"
                            />
                        </div>
                        <div class="dialog-actions">
                            <button class="cancel-button" @click=${this.closeEditDialog}>
                                Cancel
                            </button>
                            <button class="save-button" @click=${this.saveCustomer}>
                                Set as Current Customer
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

    private openEditDialog() {
        this.editName = this.customerName;
        this.editId = this.customerId;
        this.editEmail = this.customerEmail;
        this.showEditDialog = true;
    }

    private closeEditDialog() {
        this.showEditDialog = false;
    }

    private async saveCustomer() {
        if (!this.editName || !this.editId || !this.editEmail) {
            this.message = 'All fields are required';
            return;
        }

        try {
            if (this.policy) {
                // Create/lookup customer in Limitr, using our ID, the default plan, default user type, etc.
                const defaultPlan = await this.policy.defaultPlan();
                const defaultPlanName = !!defaultPlan ? defaultPlan.name as string ?? 'free' : 'free';
                await this.policy.ensureCustomer(
                    this.editId,                  // main ID for this customer
                    defaultPlanName,              // default plan
                    undefined,                    // default 'user' type
                    this.editName,                // our label for this user
                    undefined,                    // no refs (e.g. orgs, workspaces, etc)
                    undefined,                    // no alternate ids (e.g. stripe customer id, etc.)
                    { email: this.customerEmail } // general metadata for this customer (email recommended for Stripe creation)
                );
            }

            this.customerName = this.editName;
            this.customerId = this.editId;
            this.customerEmail = this.editEmail;
            this.showEditDialog = false;
            this.message = `Customer ${this.editName} set as current`;
        } catch (error) {
            this.message = `Error: ${error}`;
        }
    }

    private async chatTokens() {
        try {
            const response = await fetch('http://localhost:3000/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    customerId: this.customerId,
                    value: this.tokensInput
                })
            });
            const data = await response.json();
            this.message = `AI Chat Response - ${JSON.stringify(data)}`;
        } catch (error) {
            this.message = `Error: ${error}`;
        }
    }

    private async changeStorage() {
        try {
            const response = await fetch('http://localhost:3000/api/change-storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    customerId: this.customerId,
                    value: this.storageInput
                })
            });
            const data = await response.json();
            this.message = `Change Storage Usage Response - ${JSON.stringify(data)}`;
        } catch (error) {
            this.message = `Error: ${error}`;
        }
    }

    private async changeSeats() {
        try {
            const response = await fetch('http://localhost:3000/api/change-seats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    customerId: this.customerId,
                    value: this.seatsInput
                })
            });
            const data = await response.json();
            this.message = `Change Seat Quantity Response - ${JSON.stringify(data)}`;
        } catch (error) {
            this.message = `Error: ${error}`;
        }
    }
}
