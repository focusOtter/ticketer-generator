import sharp from 'sharp'
import * as path from 'path'
import bwipjs from 'bwip-js'
import { fileURLToPath } from 'url'
import TextToSVG from 'text-to-svg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create an SVG from text
async function generateSVG(text) {
	const textToSVG = TextToSVG.loadSync()
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

// Create a QRCode
async function generateQRCode(text) {
	let qrcodeBuffer = await bwipjs.toBuffer({
		bcid: 'qrcode',
		text,
		scale: 5,
	})

	return qrcodeBuffer
}

// Create a Barcode
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

async function createTicket(customerName, ticketId, outputPath) {
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

		const qrcodeImageBuffer = await generateQRCode(ticketId)

		const qrCodeOverlay = {
			input: qrcodeImageBuffer,
			top: 494,
			left: 3308,
		}

		// Params to overlay QR code onto the template
		const barcodeOverlay = {
			input: barcodeImageBuffer,
			left: 3393, // X position for QR code
			top: 351, // Y position for QR code
		}
		// Params to overlay SVG onto the template
		const svgOverlay = {
			input: customerNameImageBuffer,
			top: 791,
			left: 508,
		}

		// Overlay the QR Code and SVG
		await ticket
			.composite([
				// barcodeOverlay,
				qrCodeOverlay,
				svgOverlay,
			])
			.toFile(outputPath)

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
	'some-random-ticket-id',
	`output/event/holiday-walkthrough/${hyphenatedCustomerName}-ticket.png`
)
