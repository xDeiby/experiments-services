import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import ModelType from '../models/ModelType';
import { initialModels } from '../utils/test/test_helper';

const api = supertest(app);

describe('Test servicio modelos', () => {
    beforeEach(async () => {
        await ModelType.deleteMany({});

        // eslint-disable-next-line no-restricted-syntax
        for (const md of initialModels) {
            const newModel = new ModelType(md);
            // eslint-disable-next-line no-await-in-loop
            await newModel.save();
        }
    });

    it('Agregaron 2 modelos a la base de datos, correctamente', async () => {
        const response = await api
            .get('/api/model_types')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveLength(2);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = response.body.map((mod: any) => ({
            name: mod.name,
            abbreviation: mod.abbreviation,
        }));

        expect(response.body).toHaveLength(initialModels.length);
        expect(result).toEqual(initialModels);
    });

    it('Se elimina un modelo', async () => {
        const models = await ModelType.find({});
        await api.delete(`/api/model_types/${models[0].id}`).expect(204);

        const result = await api.get('/api/model_types').expect(200);

        expect(result.body).toHaveLength(initialModels.length - 1);
    });

    it('Se obtiene un modelo y se modifica un modelo', async () => {
        const modelToModify = await ModelType.find({ name: initialModels[1].name });

        await api
            .get(`/api/model_types/${modelToModify[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const modify = await api
            .put(`/api/model_types/${modelToModify[0].id}`)
            .send({ name: 'Model modify' })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(modify.body.name).toEqual('Model modify');
    });
});

afterAll(() => {
    mongoose.connection.close();
});
