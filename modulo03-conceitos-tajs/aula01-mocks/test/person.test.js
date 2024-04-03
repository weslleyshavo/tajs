import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person";

describe("#Person Suite", () => {
  describe("#validate", () => {
    it("sould throw if the name is not present", () => {
      const mockInvalidPerson = {
        name: "",
        cpf: "123.456.789-00",
      };
      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("name is required")
      );
    });
    it("sould throw if the cpf is not present", () => {
      const mockInvalidPerson = {
        name: "Fulano de Tal",
        cpf: "",
      };
      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        new Error("cpf is required")
      );
    });
    it("sould not throw person is valid", () => {
      const mockInvalidPerson = {
        name: "Fulano de Tal",
        cpf: "123.456.789-00",
      };
      expect(() => Person.validate(mockInvalidPerson)).not.toThrow();
    });
  });

  describe("#format", () => {
    // parte do principio que os dados já foram validados
    it("sould format the person name and CPF", () => {
      // AAA:

      // Arrange = Prepara
      const mockPerson = {
        name: "Xuxa da Silva",
        cpf: "000.999.444-11",
      };

      // Act = Executar
      const formattedPerson = Person.format(mockPerson);

      // Assert = Validar
      const expected = {
        cpf: "00099944411",
        name: "Xuxa",
        lastName: "da Silva",
      };

      expect(formattedPerson).toStrictEqual(expected);
    });
  });

  describe("#save", () => {
    it("sould throw if the cpf is not present", () => {
      const mockInvalidPerson = {
        cpf: "",
        name: "Xuxa",
        lastName: "da Silva",
      };
      expect(() => Person.save(mockInvalidPerson)).toThrow(
        new Error(
          'cannot save invalid person: {"cpf":"","name":"Xuxa","lastName":"da Silva"}'
        )
      );
    });
    it("sould throw if the name is not present", () => {
      const mockInvalidPerson = {
        cpf: "12345678900",
        name: "",
        lastName: "da Silva",
      };
      expect(() => Person.save(mockInvalidPerson)).toThrow(
        new Error(
          'cannot save invalid person: {"cpf":"12345678900","name":"","lastName":"da Silva"}'
        )
      );
    });
    it("sould throw if the lastName is not present", () => {
      const mockInvalidPerson = {
        cpf: "12345678900",
        name: "Xuxa",
        lastName: "",
      };
      expect(() => Person.save(mockInvalidPerson)).toThrow(
        new Error(
          'cannot save invalid person: {"cpf":"12345678900","name":"Xuxa","lastName":""}'
        )
      );
    });
    it("sould not throw person is valid on save", () => {
      const mockInvalidPerson = {
        cpf: "12345678900",
        name: "Xuxa",
        lastName: "da Silva",
      };
      expect(() => Person.save(mockInvalidPerson)).not.toThrow();
    });
  });

  describe("#process", () => {
    it("sould process a valid person", () => {
      // Uma outra ideia é não retestar o que já foi testado
      // lembra dos checkpoints?
      // Testou do caminho A ao caminho C, agora testa do caminho C ao caminho D
      // Então aqui, eu pulo o caminho A (validate), caminho B (format), caminho C (save)
      // e vou direto para o caminho D, pois estes caminhos já foram validados
      // Este metodo abaixo faz mais sentido para quando se tem iterações externas como
      // chamadas API, banco de dados, etc (que será mostrado na próxima aula)

      const mockPerson = {
        name: "Zezin da Silva",
        cpf: "123.456.789-00",
      };
      jest
        .spyOn(Person, Person.validate.name)
        .mockReturnValue();
        // .mockImplementation(() => { throw new Error('Deu ruim!') });
      jest
        .spyOn(Person, Person.format.name)
        .mockReturnValue({
          cpf: "12345678900",
          name: "Zezin",
          lastName: "da Silva",
        });

      const result = Person.process(mockPerson);

      const expected = "ok";
      expect(result).toStrictEqual(expected);
    });
  });
});
