import sharp from 'sharp'
import * as path from 'path'
import bwipjs from 'bwip-js'
import { fileURLToPath } from 'url'
import TextToSVG from 'text-to-svg'

const textToSVG = TextToSVG.loadSync()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a QR Code
async function generateBarcode(text) {
	let svg = bwipjs.toSVG({
		bcid: 'code128', // Barcode type
		text, // Text to encode
		width: 80,
		// includetext: true, // Show human-readable text
		textxalign: 'center', // Always good to set this
		textcolor: 'ff0000', // Red text
		rotate: 'L',
	})
	return Buffer.from(svg)
}

// Create an SVG from text
async function generateSVG(text) {
	try {
		const svg = textToSVG.getSVG(text, {
			fontSize: 110,
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
async function createTicket(customerName, ticketId, outputPath) {
	// load the ticket template
	const ticketTemplatePath = path.join(
		__dirname,
		'./xmas-sample-ticket-hi-res.png'
	)
	const ticket = sharp(ticketTemplatePath)

	try {
		// Generate  barcode for the ticket as buffer
		const barcodeImageBuffer = await generateBarcode(ticketId)

		// Generate customer name for ticket as buffer
		const customerNameImageBuffer = await generateSVG(customerName)

		// Params to overlay QR code onto the template
		const barcodeOverlay = {
			input: barcodeImageBuffer,
			left: 3400, // X position for QR code
			top: 400, // Y position for QR code
		}
		// Params to overlay SVG onto the template
		const svgOverlay = {
			input: customerNameImageBuffer,
			top: 700,
			left: 600,
		}

		// Overlay the QR Code and SVG
		await ticket.composite([barcodeOverlay, svgOverlay]).toFile(outputPath)

		console.log('Ticket created!')
	} catch (err) {
		console.error('Error creating ticket:', err)
		throw err
	}
}

// Example usage
const customerName = 'Focus Otter'
const hyphenatedCustomerName = customerName.toLowerCase().replace(' ', '-')
createTicket(
	customerName,
	'some-random-id',
	`output/event/holiday-walkthrough/${hyphenatedCustomerName}-ticket.png`
)
