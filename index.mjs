import sharp from 'sharp'
import * as path from 'path'
import { toBuffer } from 'qrcode'
import { fileURLToPath } from 'url'
import TextToSVG from 'text-to-svg'

const textToSVG = TextToSVG.loadSync()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a QR Code
async function generateQRCode(text) {
	try {
		return await toBuffer(text, { type: 'png', scale: 5 })
	} catch (err) {
		console.error('Error generating QR code:', err)
		throw err
	}
}

// Create an SVG from text
async function generateSVG(text) {
	try {
		const svg = textToSVG.getSVG(text, {
			fontSize: 46,
			anchor: 'top',
			attributes: { fill: 'black' },
		})
		return Buffer.from(svg)
	} catch (err) {
		console.error('Error generating SVG:', err)
		throw err
	}
}

// Create the ticket
async function createTicket(ticketNumber, outputPath) {
	// load the ticket template
	const ticketTemplatePath = path.join(__dirname, './xmas-sample-ticket.png')
	const ticket = sharp(ticketTemplatePath)

	try {
		// Generate QR code for the ticket as buffer
		const qrCodeImageBuffer = await generateQRCode(
			`https://myWebsiteToRedeemTicket.com/redeem/${ticketNumber}`
		)

		// Generate SVG from text as buffer
		const svgImageBuffer = await generateSVG(ticketNumber)

		// Params to overlay QR code onto the template
		const qrCodeOverlay = {
			input: qrCodeImageBuffer,
			left: 1636, // X position for QR code
			top: 325, // Y position for QR code
		}
		// Params to overlay SVG onto the template
		const svgOverlay = {
			input: svgImageBuffer,
			top: 384,
			left: 287,
		}

		// Overlay the QR Code and SVG
		await ticket.composite([qrCodeOverlay, svgOverlay]).toFile(outputPath)

		console.log('Ticket created!')
	} catch (err) {
		console.error('Error creating ticket:', err)
		throw err
	}
}

// Example usage
const customerName = 'Michael Liendo'
const hyphenatedCustomerName = customerName.toLowerCase().replace(' ', '-')
createTicket(
	customerName,
	`output/event/holiday-walkthrough/${hyphenatedCustomerName}-ticket.png`
)
