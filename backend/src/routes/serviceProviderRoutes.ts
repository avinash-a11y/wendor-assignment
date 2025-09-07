import { Router } from 'express';
import { ServiceProviderController } from '../controllers/ServiceProviderController';
import { validateServiceProviderId } from '../middleware/validation';
import ServiceProviderRegistrationController from '../controllers/ServiceProviderRegistrationController';

const router = Router();
const serviceProviderController = new ServiceProviderController();

// Get all service providers with optional filters
router.get('/', serviceProviderController.getServiceProviders.bind(serviceProviderController));

// Get service types
router.get('/types', serviceProviderController.getServiceTypes.bind(serviceProviderController));

// Register new service provider
router.post('/register', ServiceProviderRegistrationController.registerServiceProvider.bind(ServiceProviderRegistrationController));

// Get service provider details
router.get('/:serviceProviderId', validateServiceProviderId, serviceProviderController.getServiceProviderDetails.bind(serviceProviderController));

export default router;
