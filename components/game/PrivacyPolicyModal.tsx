
import React from 'react';
import Modal from '../ui/Modal';

interface PrivacyPolicyModalProps {
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
    return (
        <Modal title="About & Privacy Policy" onClose={onClose}>
            <div className="text-gray-300 text-sm max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                <h3 className="text-lg text-yellow-300">About Click2Mine</h3>
                <p>
                    Click2Mine - The Gold Rush is a casual mining game developed by SM Studio Inc. We are dedicated to providing a fun and engaging experience for our players.
                </p>

                <h3 className="text-lg text-yellow-300">Privacy Policy</h3>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>

                <p>
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information. By playing our game, you agree to the collection and use of information in accordance with this policy.
                </p>

                <h4 className="text-md text-yellow-400">Information Collection and Use</h4>
                <p>
                    We collect several types of information for various purposes to provide and improve our game for you.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Personal Data:</strong> When you sign up, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include your email address and a username. We use this to save your game progress and for authentication purposes.</li>
                    <li><strong>Game Data:</strong> We track your in-game progress, including gold, gems, equipment, and other game-related statistics. This data is stored on secure servers (Firebase Realtime Database) to allow you to play across multiple devices and to maintain leaderboards.</li>
                </ul>
                
                <h4 className="text-md text-yellow-400">Third-Party Services</h4>
                <p>
                    We use third-party services to operate our game.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                     <li><strong>Firebase (by Google):</strong> We use Firebase for backend services, including authentication (Google Sign-In, Email/Password) and the Realtime Database to store your game data. You can review Google's privacy policy <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">here</a>.</li>
                </ul>

                <h4 className="text-md text-yellow-400">Advertising</h4>
                <p>
                    Our game may display advertisements from third-party ad networks (e.g., Google AdMob). These networks may collect and use information about your device and your interaction with ads to provide personalized advertising. This may include device identifiers, IP addresses, and geolocation data. We do not share your personal game account data (like email or username) directly with advertisers.
                </p>
                
                <h4 className="text-md text-yellow-400">Data Security</h4>
                <p>
                    The security of your data is a priority. We use commercially acceptable means to protect your Personal Data, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
                </p>

                <h4 className="text-md text-yellow-400">Children's Privacy</h4>
                <p>
                    Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
                </p>

                <h4 className="text-md text-yellow-400">Changes to This Privacy Policy</h4>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
                
                <h4 className="text-md text-yellow-400">Contact Us</h4>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at: support@smstudioinc.com
                </p>

            </div>
        </Modal>
    );
};

export default PrivacyPolicyModal;
