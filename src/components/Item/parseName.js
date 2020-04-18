import units from "./units";

export default function (itemDescription) {
    //support two formats:
    //prefix: 100ml Milk
    //postfix: Milk 100ml
    try {
        const prefixRegex = new RegExp(`^((\\d)+)\\s?(${units.join('|')})?\\s((.)+)$`)
        const prefixMatch = itemDescription.match(prefixRegex)
        if (prefixMatch) {
            return {
                name: prefixMatch[4],
                quantity: prefixMatch[1],
                unit: prefixMatch[3] || ''
            }
        }

        const postfixRegex = new RegExp(`^((.)+)\\s((\\d)+)\\s?(${units.join('|')})?$`)
        const postfixMatch = itemDescription.match(postfixRegex)
        if (postfixMatch) {
            return {
                name: postfixMatch[1],
                quantity: postfixMatch[3],
                unit: postfixMatch[5] || ''
            }
        }
    } catch (e) {
        // fallback for any unforeseen format
        return { name: itemDescription, quantity: 1 }
    }
    return { name: itemDescription, quantity: 1 }
}