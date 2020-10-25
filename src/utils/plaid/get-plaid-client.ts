import * as plaid from 'plaid';
import getPlaidConfig from './get-plaid-config';

export default function getPlaidClient(): plaid.Client {
	const config = getPlaidConfig();
	return new plaid.Client(config);
}
