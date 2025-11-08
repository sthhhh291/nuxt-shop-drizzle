"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedContacts = seedContacts;
var sqlite_service_1 = require("~~/server/sqlite-service");
var schema_1 = require("~~/db/schema");
var sync_1 = require("csv-parse/sync");
var fs_1 = require("fs");
var path_1 = require("path");
var contactSeeds = (0, sync_1.parse)(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "./Contact.txt"), "utf-8"), {
    columns: true,
    skip_empty_lines: true,
});
console.log("Parsed ".concat(contactSeeds.length, " contacts from CSV."));
function seedContacts() {
    return __awaiter(this, void 0, void 0, function () {
        var successCount, errorCount, _loop_1, _i, contactSeeds_1, contact;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    successCount = 0;
                    errorCount = 0;
                    _loop_1 = function (contact) {
                        var id, last_name, first_name, bus_street, bus_city, bus_state, bus_zip, home_street, home_city, home_state, home_zip, bus_phone, home_phone, cell_phone, fax, other_phone, email, newCustomer_1, addressesToInsert, phonesToInsert, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 8, , 9]);
                                    id = contact.id, last_name = contact.last_name, first_name = contact.first_name, bus_street = contact.bus_street, bus_city = contact.bus_city, bus_state = contact.bus_state, bus_zip = contact.bus_zip, home_street = contact.home_street, home_city = contact.home_city, home_state = contact.home_state, home_zip = contact.home_zip, bus_phone = contact.bus_phone, home_phone = contact.home_phone, cell_phone = contact.cell_phone, fax = contact.fax, other_phone = contact.other_phone, email = contact.email;
                                    return [4 /*yield*/, sqlite_service_1.db
                                            .insert(schema_1.customers)
                                            .values({
                                            first_name: first_name || "",
                                            last_name: last_name || "",
                                            notes: "Imported contact with ID ".concat(id),
                                        })
                                            .returning()];
                                case 1:
                                    newCustomer_1 = (_b.sent())[0];
                                    addressesToInsert = [];
                                    if (bus_street) {
                                        addressesToInsert.push({
                                            street: bus_street,
                                            city: bus_city || "",
                                            state: bus_state || "",
                                            zip_code: bus_zip || "",
                                            address_type: "business",
                                            customer_id: newCustomer_1.id,
                                        });
                                    }
                                    if (home_street) {
                                        addressesToInsert.push({
                                            street: home_street,
                                            city: home_city || "",
                                            state: home_state || "",
                                            zip_code: home_zip || "",
                                            address_type: "home",
                                            customer_id: newCustomer_1.id,
                                        });
                                    }
                                    if (!(addressesToInsert.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, sqlite_service_1.db.insert(schema_1.addresses).values(addressesToInsert)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    phonesToInsert = [
                                        { phone: bus_phone, type: "business" },
                                        { phone: home_phone, type: "home" },
                                        { phone: cell_phone, type: "cell" },
                                        { phone: fax, type: "fax" },
                                        { phone: other_phone, type: "other" },
                                    ]
                                        .filter(function (p) { return p.phone && p.phone.trim() !== ""; })
                                        .map(function (p) { return ({
                                        phone_number: p.phone,
                                        phone_type: p.type,
                                        customer_id: newCustomer_1.id,
                                    }); });
                                    if (!(phonesToInsert.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, sqlite_service_1.db.insert(schema_1.phones).values(phonesToInsert)];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    if (!(email && email.trim() !== "")) return [3 /*break*/, 7];
                                    return [4 /*yield*/, sqlite_service_1.db.insert(schema_1.emails).values({
                                            email_address: email,
                                            email_type: "personal",
                                            customer_id: newCustomer_1.id,
                                        })];
                                case 6:
                                    _b.sent();
                                    _b.label = 7;
                                case 7:
                                    successCount++;
                                    if (successCount % 100 === 0) {
                                        console.log("Processed ".concat(successCount, " contacts..."));
                                    }
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_1 = _b.sent();
                                    errorCount++;
                                    console.error("Error processing contact ID ".concat(contact.id, ":"), error_1);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, contactSeeds_1 = contactSeeds;
                    _a.label = 1;
                case 1:
                    if (!(_i < contactSeeds_1.length)) return [3 /*break*/, 4];
                    contact = contactSeeds_1[_i];
                    return [5 /*yield**/, _loop_1(contact)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Seeding complete! Success: ".concat(successCount, ", Errors: ").concat(errorCount));
                    return [2 /*return*/];
            }
        });
    });
}
