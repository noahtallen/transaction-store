import plaid, { Client } from 'plaid';
import getPlaidConfig from './get-plaid-config';

export default function getPlaidClient(): Client {
	const config = getPlaidConfig();
	return new plaid.Client(config);
}
