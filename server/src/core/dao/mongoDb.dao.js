import { Logger } from "../../utils/logger.js"; // Asegúrate de que la ruta sea correcta


export default class MongoDao {
  constructor(model) {
    if (!model) {
      throw new Error("El modelo de Mongoose es requerido para inicializar MongoDao.");
    }
    this.model = model;
  }


  async save(data) {
    const newDocument = await this.model.create(data);
    return newDocument;
  }

  /**
   * Retrieves all documents from the collection based on the specified filter, projection, and options.
   * Utilizes `lean()` for performance optimization in read operations.
   * 
   * @param {Object} filter - The filter criteria for querying documents. Defaults to an empty object.
   * @param {Object|null} projection - The fields to include or exclude in the returned documents. Defaults to null.
   * @param {Object} options - Additional query options. Defaults to an empty object.
   * @returns {Promise<Array<Object>>} - A promise that resolves to an array of documents.
   */

  async getAll(filter = {}, projection = null, options = {}) {
    const documents = await this.model.find(filter, projection, options).lean(); // .lean() para rendimiento en lecturas
    return documents;
  }

  /**
   * Retrieves a single document from the collection based on the specified filter, projection, and options.
   * Utilizes `lean()` for performance optimization in read operations.
   * 
   * @param {Object} filter - The filter criteria for querying documents. Defaults to an empty object.
   * @param {Object|null} projection - The fields to include or exclude in the returned document. Defaults to null.
   * @param {Object} options - Additional query options. Defaults to an empty object.
   * @returns {Promise<Object>} - A promise that resolves to the matched document, or null if no document is found.
   */
  async getOne(filter = {}, projection = null, options = {}) {
    const document = await this.model.findOne(filter, projection, options).lean();
    return document;
  }

  async update(id, data, options = { new: true, runValidators: true }) {
    // new:true devuelve el documento actualizado, runValidators:true aplica validadores del schema
    const updatedDocument = await this.model.findByIdAndUpdate(id, data, options).lean();
    return updatedDocument;
  }

  async delete(id) {
    const deletedDocument = await this.model.findByIdAndDelete(id).lean();
    return deletedDocument;
  }

  async deleteMany(filter = {}) {
    const result = await this.model.deleteMany(filter);
    return result; // Retorna { acknowledged: boolean, deletedCount: number }
  }
}

